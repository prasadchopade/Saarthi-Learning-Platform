const Presentation = require('../models/presentationModel');
const { getGeminiModel } = require('../utils/geminiConfig');
const { extractYoutubeContent, extractPdfContent } = require('../utils/contentExtractor');
const s3Service = require('../services/s3Service');

/**
 * Generate presentation content using Gemini AI
 * @param {string} topic - The topic for the presentation
 * @param {string} mode - The learning mode (exam_prep, deep_learning, quick_summary)
 * @returns {Promise<Object>} - Generated presentation data
 */
const generatePresentationContent = async (type, content, mode, userId) => {
  try {
    const model = await getGeminiModel(userId);
    let prompt = `you are an expert educational content creator with excellent communication skills and perfect writing style. As a human tutor create a comprehensive, educational presentation With human speech style explanation about "${type === 'topic' ? content : type === 'youtube' ? 'YouTube Video' : 'PDF book'}" ${type === 'pdf' ? `with the following content: ${content || ''}` : ''} in JSON format. `;
    
    switch (mode) {
      case 'exam_prep':
        prompt += `Focus on key concepts that would be important for exams, include practice questions, and highlight important definitions. Around 10-20 slides.`;
        break;
      case 'deep_learning':
        prompt += `Provide detailed explanations, comprehensive coverage of the topic with in-depth analysis. Minimum 25 slides. Maximum 50 slides. `;
        break;
      case 'quick_summary':
        prompt += `Give a brief overview of the main points, focusing on the most essential information. Maximum 10 slides. `;
        break;
      default:
        prompt += `Provide a balanced educational overview of the topic. `;
    }
    
    prompt += `
    The JSON structure should follow this format:
    {
      "title": "Main Presentation Title",
      "subtitle": "Optional Subtitle",
      "description": "Brief description of the presentation content",
      "theme": "default",
      "slides": [
        // Slides array with various slide types
      ]
    }
    
    Each slide should have the following base structure:
    {
      "type": "slide_type",
      "content": {
        // Content varies based on slide type
      },
      "transcript": "Detailed speaking notes from teacher perspective for this slide(human speech style)"
    }
    
    slide types(not necessary to include all of them, use only the ones that are relevant according to the content):
    
    1. "title" slide:
    {
      "type": "title",
      "content": {
        "title": "Main Title",
        "subtitle": "Optional Subtitle"
      },
      "transcript": "Introduction transcript"
    }
    
    2. "bullets" slide:
    {
      "type": "bullets",
      "content": {
        "title": "Slide Title",
        "bullets": [
          "Simple bullet point text",
          "Another bullet point",
          "Third bullet point"
        ]
      },
      "transcript": "Detailed explanation"
    }
    
    3. "columns" slide:
    {
      "type": "columns",
      "content": {
        "title": "Slide Title",
        "columns": [
          {
            "heading": "Column Heading",
            "text": "Column description text",
            "examples": ["Example 1", "Example 2"],
            "explanation": "Detailed explanation"
          }
        ]
      },
      "transcript": "Column slide transcript"
    }
    
    4. "timeline" slide:
    {
      "type": "timeline",
      "content": {
        "title": "Timeline Title",
        "layout": "horizontal or vertical",
        "events": [
          {
            "date": "Time period",
            "title": "Event title",
            "description": "Event description"
          }
        ]
      },
      "transcript": "Timeline explanation"
    }
    
    5. "image" slide:
    {
      "type": "image",
      "content": {
        "title": "Image Title",
        "layout": "full, left, right",
        "image": "Image URL",
        "caption": "Image caption"
      },
      "transcript": "Image explanation"
    }
    
    7. "comparison" slide:
    {
      "type": "comparison",
      "content": {
        "title": "Comparison Title",
        "items": [
          {
            "title": "Item Title",
            "points": [
              "Point 1",
              "Point 2"
            ]
          }
        ]
      },
      "transcript": "Comparison explanation"
    }
    
    For each slide:
    - Provide a very detailed transcript(human speech style) that teaches the user about the content thoroughly
    - Make the content educational, accurate, and engaging
    - Ensure all content is factually correct and appropriately structured
    - The number of slides should be appropriate for the content and the aim of the presentation is to teach the user about the topic as per the mode
    
    Return ONLY valid JSON without any explanations or markdown formatting.`;

    // Generate content
    let result;
    if (type === 'youtube') {
      result = await model.generateContent([
        prompt,
        {
          fileData: {
            fileUri: content,
          },
        },
      ]);
    } else {
      result = await model.generateContent(prompt);
    }
    const response = await result.response;
    const text = response.text();

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in response:', text);
        throw new Error('No valid JSON found in the response');
      }
      
      const jsonText = jsonMatch[0];
      
      // Try to parse the JSON
      try {
        const parsedData = JSON.parse(jsonText);
        
        // Validate the essential structure
        if (!parsedData.title || !Array.isArray(parsedData.slides) || parsedData.slides.length === 0) {
          console.error('Invalid presentation structure:', parsedData);
          throw new Error('Invalid presentation structure');
        }
        return parsedData;
      } catch (syntaxError) {
        console.error('JSON syntax error:', syntaxError, 'in text:', jsonText);
        
        // Try to fix common JSON issues and retry
        const cleanedJson = jsonText
          .replace(/,(\s*[\]}])/g, '$1') // Remove trailing commas
          .replace(/'/g, '"') // Replace single quotes with double quotes
          .replace(/(\w+):/g, '"$1":') // Add quotes to keys without quotes
          .replace(/:\s*"?([^"]*?)"?\s*([,}])/g, ': "$1"$2'); // Ensure string values have quotes
        
        try {
          return JSON.parse(cleanedJson);
        } catch (fallbackError) {
          console.error('Failed to parse even after cleanup:', fallbackError);
          throw new Error('Failed to parse presentation data');
        }
      }
    } catch (parseError) {
      console.error('Error processing JSON response:', parseError);
      throw new Error('Failed to process presentation data');
    }
  } catch (error) {
    console.error('Error generating presentation content:', error);
    throw error;
  }
};

/**
 * Create a new presentation
 * @route POST /api/presentations
 */
exports.createPresentation = async (req, res) => {
  try {
    const { type, content, mode, file, startPage, endPage } = req.body;
    
    // Create initial presentation record
    const presentation = new Presentation({
      user: req.user._id,
      title: type === 'topic' ? content : type === 'youtube' ? 'YouTube Presentation' : 'PDF Presentation',
      inputType: type,
      inputContent: content,
      mode: mode || 'deep_learning',
      status: 'processing'
    });
    await presentation.save();
    let Content = '';
    if (type === 'topic') {
      Content = content;
    } else if (type === 'youtube') {
      Content = content;
    } else if (type === 'pdf') {
      Content = await extractPdfContent(file, startPage, endPage);
    }

    generatePresentationContent(type, Content, mode, req.user._id)
      .then(async (presentationData) => {
        // Update the presentation with generated content
        presentation.title = presentationData.title;
        presentation.subtitle = presentationData.subtitle;
        presentation.description = presentationData.description;
        presentation.theme = presentationData.theme;
        presentation.slides = presentationData.slides;
        presentation.status = 'completed';
        
        await presentation.save();
      })
      .catch(async (error) => {
        console.error('Error in background presentation generation:', error);
        presentation.status = 'failed';
        presentation.error = error.message;
        await presentation.save();
      });
    
    // Return the presentation ID immediately
    res.status(201).json({
      presentationId: presentation._id,
      message: 'Presentation creation started'
    });
  } catch (error) {
    console.error('Error creating presentation:', error);
    res.status(500).json({ message: 'Failed to create presentation', error: error.message });
  }
};

/**
 * Get all presentations for the current user
 * @route GET /api/presentations
 */
exports.getPresentations = async (req, res) => {
  try {
    const presentations = await Presentation.find({ user: req.user._id, status: 'completed' })
      .sort({ createdAt: -1 })
      .select('title subtitle description status createdAt mode');
    res.json(presentations);
  } catch (error) {
    console.error('Error fetching presentations:', error);
    res.status(500).json({ message: 'Failed to fetch presentations', error: error.message });
  }
};

/**
 * Get a presentation by ID
 * @route GET /api/presentations/:id
 */
exports.getPresentation = async (req, res) => {
  try {
    const presentation = await Presentation.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!presentation) {
      return res.status(404).json({ message: 'Presentation not found' });
    }
    presentation.slides = await Promise.all(presentation.slides.map(async (slide) => {
      if (slide.audioKey) {
        slide.audio = await s3Service.getPresignedUrl(slide.audioKey);
        slide.audioKey = undefined;
      } 
      return slide;
    }));
    
    res.json(presentation);
  } catch (error) {
    console.error('Error fetching presentation:', error);
    res.status(500).json({ message: 'Failed to fetch presentation', error: error.message });
  }
};

/**
 * Update a presentation
 * @route PUT /api/presentations/:id
 */
exports.updatePresentation = async (req, res) => {
  try {
    const { title, subtitle, description, theme, slides } = req.body;
    
    const presentation = await Presentation.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!presentation) {
      return res.status(404).json({ message: 'Presentation not found' });
    }
    
    // Update fields
    if (title) presentation.title = title;
    if (subtitle) presentation.subtitle = subtitle;
    if (description) presentation.description = description;
    if (theme) presentation.theme = theme;
    if (slides) presentation.slides = slides;
    
    await presentation.save();
    
    res.json(presentation);
  } catch (error) {
    console.error('Error updating presentation:', error);
    res.status(500).json({ message: 'Failed to update presentation', error: error.message });
  }
};

/**
 * Get presentation status
 * @route GET /api/presentations/:id/status
 */
exports.getPresentationStatus = async (req, res) => {
  try {
    const presentation = await Presentation.findOne({
      _id: req.params.id,
      user: req.user._id
    }).select('status error progress');
    
    if (!presentation) {
      return res.status(404).json({ message: 'Presentation not found' });
    }
    
    // Calculate progress based on status
    let progress = 0;
    let message = 'Initializing...';
    
    switch (presentation.status) {
      case 'processing':
        progress = 50;
        message = 'Generating presentation content...';
        break;
      case 'completed':
        progress = 100;
        message = 'Presentation generation complete!';
        break;
      case 'failed':
        progress = 0;
        message = presentation.error || 'Generation failed';
        break;
      default:
        progress = 25;
        message = 'Starting generation...';
    }
    res.json({
      status: presentation.status,
      message: message,
      progress: progress,
      error: presentation.error
    });
  } catch (error) {
    console.error('Error getting presentation status:', error);
    res.status(500).json({ message: 'Failed to get presentation status', error: error.message });
  }
};

/**
 * Delete a presentation
 * @route DELETE /api/presentations/:id
 */
exports.deletePresentation = async (req, res) => {
  try {
    const presentation = await Presentation.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!presentation) {
      return res.status(404).json({ message: 'Presentation not found' });
    }
    
    res.json({ message: 'Presentation deleted successfully' });
  } catch (error) {
    console.error('Error deleting presentation:', error);
    res.status(500).json({ message: 'Failed to delete presentation', error: error.message });
  }
};
