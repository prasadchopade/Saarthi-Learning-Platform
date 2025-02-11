const Notebook = require('../models/notebookModel');
const s3Service = require('../services/s3Service');

const getNotebooks = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!userId) {
            return res.status(400).json({ error: 'Owner is required' });
        }

        const notebooks = await Notebook.find({ owner: userId }).select('title');
        res.json(notebooks);
    } catch (error) {
        console.error('Error fetching notebooks:', error);
        res.status(500).json({ error: 'Error fetching notebooks' });
    }
};

const createNotebook = async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.user._id;

        if (!userId || !title) {
            return res.status(400).json({ error: 'Owner and title are required' });
        }

        const newNotebook = new Notebook({
            owner: userId,
            title,
            content: '',
            images: []
        });

        await newNotebook.save();
        res.status(201).json(newNotebook);
    } catch (error) {
        console.error('Error creating notebook:', error);
        res.status(500).json({ error: 'Error creating notebook' });
    }
};

const deleteNotebook = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const notebook = await Notebook.findOne({ _id: id, owner: userId });

        if (!notebook) {
            return res.status(404).json({ error: 'Notebook not found or you do not have permission to delete this notebook' });
        }
        
        // Delete any embedded images
        if (notebook.images && notebook.images.length > 0) {
            const deletePromises = notebook.images.map(image => 
                s3Service.deleteFile(image.key)
            );
            await Promise.all(deletePromises);
        }
        
        // Delete the notebook document
        await Notebook.deleteOne({ _id: id });

        res.status(200).json({ message: 'Notebook deleted' });
    } catch (error) {
        console.error('Error deleting notebook:', error);
        res.status(500).json({ error: 'Error deleting notebook' });
    }
};

const saveNotebookContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, images } = req.body;
        const userId = req.user._id;
        
        // Get the current notebook to access its existing images
        const existingNotebook = await Notebook.findOne({ _id: id, owner: userId });
        
        if (!existingNotebook) {
            return res.status(404).json({ error: 'Notebook not found' });
        }
        
        // Prepare the update object
        const updateData = { content };
        
        // If images were provided, add them to the notebook's images array
        if (images && images.images && images.images.length > 0) {
            // Map the uploaded images to the format we want to store
            const newImages = images.images.map(img => ({
                id: img.id,
                key: img.key,
            }));
            
            // Combine with existing images (if any)
            updateData.images = [...(existingNotebook.images || []), ...newImages];
        }
        
        // Update the notebook
        const notebook = await Notebook.findByIdAndUpdate(
            { _id: id, owner: userId },
            updateData,
            { new: true }
        );

        // Process the content to replace temp IDs with presigned URLs
        let processedContent = notebook.content;
        
        if (notebook.images && notebook.images.length > 0) {
            notebook.images.forEach(image => {
                const presignedUrl = s3Service.getPresignedUrl(image.key);
                // Replace all instances of temp:imageId with the presigned URL
                const tempIdPattern = new RegExp(`temp:${image.id}`, 'g');
                processedContent = processedContent.replace(tempIdPattern, presignedUrl);
            });
        }

        res.status(200).json({
            ...notebook.toObject(),
            content: processedContent
        });
    } catch (error) {
        console.error('Error updating notebook content:', error);
        res.status(500).json({ error: 'Error updating notebook content' });
    }
};

const getNotebookContent = async (req, res) => {
    try {
        const { id } = req.params;

        const notebook = await Notebook.findById(id);

        if (!notebook) {
            return res.status(404).json({ error: 'Notebook not found' });
        }
        
        // Process the content to replace image keys with presigned URLs
        let processedContent = notebook.content;
        
        if (notebook.images && notebook.images.length > 0) {
            notebook.images.forEach(image => {
                const presignedUrl = s3Service.getPresignedUrl(image.key);
                // Replace all instances of temp:imageId with the presigned URL
                const tempIdPattern = new RegExp(`temp:${image.id}`, 'g');
                processedContent = processedContent.replace(tempIdPattern, presignedUrl);
            });
        }

        res.status(200).json(processedContent);
    } catch (error) {
        console.error('Error retrieving notebook content:', error);
        res.status(500).json({ error: 'Error retrieving notebook content' });
    }
};

module.exports = {
    getNotebooks,
    createNotebook,
    deleteNotebook,
    saveNotebookContent,
    getNotebookContent
};