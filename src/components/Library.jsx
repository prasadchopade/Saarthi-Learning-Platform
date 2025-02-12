import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faTrash, 
  faPen, 
  faBook,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import notebookService from '../services/notebookService';

const Library = ({ setSelectedNotebookId }) => {
  const [notebooks, setNotebooks] = useState([]);
  const [newNotebookTitle, setNewNotebookTitle] = useState('');
  const [showCreateNotebookModal, setShowCreateNotebookModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotebooks();
  }, []);

  const fetchNotebooks = async () => {
    try {
      const data = await notebookService.getNotebooks();
      setNotebooks(data);
    } catch (error) {
      console.error('Error fetching notebooks');
    }
  };

  const createNotebook = async () => {
    if (!newNotebookTitle.trim()){
      toast.error('Please enter a title for the notebook');
      return;
    }
    
    try {
      
      const notebookData = {
        title: newNotebookTitle
      };
      
      // Create the notebook
      const newNotebook = await notebookService.createNotebook(notebookData);
      
      setNotebooks([...notebooks, newNotebook]);
      setNewNotebookTitle('');
      setIsCreating(false);
      setShowCreateNotebookModal(false);
      toast.success('Notebook created successfully');
    } catch (error) {
      console.error('Error creating notebook:', error);
    } finally {
      setIsCreating(false);
      setShowCreateNotebookModal(false);
    }
  };

  const deleteNotebook = async (notebookId) => {
    try {
      await notebookService.deleteNotebook(notebookId);
      fetchNotebooks();
      toast.success('Notebook deleted successfully');
    } catch (error) {
      console.error('Error deleting notebook:', error);
      toast.error('Failed to delete notebook');
    }
  };

  const filteredNotebooks = notebooks.filter(notebook => 
    notebook.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full font-inter overflow-auto bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-zinc-100 dark:border-gray-800 z-10">
        <div className="px-6 py-4">
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
            My Notebooks
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Create and manage your learning notes
          </p>
        </div>

        {/* Search and Create Section */}
        <div className="px-6 py-3 flex gap-3">
          <div className="relative flex-1">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" 
            />
            <input
              type="text"
              placeholder="Search notebooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-gray-800 
                       border border-zinc-200 dark:border-gray-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 
                       focus:border-indigo-500 dark:focus:border-indigo-400
                       text-zinc-800 dark:text-zinc-100 text-sm 
                       placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateNotebookModal(true)}
            className="px-4 py-2 bg-indigo-500 dark:bg-indigo-600 text-white rounded-xl 
                     hover:bg-indigo-600 dark:hover:bg-indigo-500
                     transition-colors flex items-center gap-2 text-sm font-medium
                     shadow-sm hover:shadow-md"
          >
            <FontAwesomeIcon icon={faPlus} />
            New Notebook
          </motion.button>
        </div>
      </div>

      {/* Notebooks Grid */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotebooks.map((notebook) => (
            <motion.div
              key={notebook._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-4 
                       border border-zinc-200/80 dark:border-gray-700/80
                       hover:border-indigo-500/30 dark:hover:border-indigo-400/30 
                       hover:shadow-lg hover:shadow-indigo-500/5 dark:hover:shadow-indigo-400/5
                       transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-400/10 
                                flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                    <FontAwesomeIcon icon={faBook} />
                  </div>
                  <div>
                    <h3 className="font-medium text-zinc-800 dark:text-zinc-100 line-clamp-1">
                      {notebook.title}
                    </h3>
                  </div>
                </div>
                <div className="flex  opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setSelectedNotebookId(notebook._id)}   
                    className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-gray-700 
                             text-zinc-600 dark:text-zinc-400
                             hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button
                    onClick={() => deleteNotebook(notebook._id)}
                    className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 
                             text-zinc-600 dark:text-zinc-400
                             hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Notebook Modal */}
      {showCreateNotebookModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 
                   flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && setShowCreateNotebookModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md 
                     shadow-xl dark:shadow-2xl border border-zinc-200/50 dark:border-gray-700/50"
          >
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4">
              Create New Notebook
            </h3>
            
            {/* Title Input */}
            <input
              type="text"
              value={newNotebookTitle}
              onChange={(e) => setNewNotebookTitle(e.target.value)}
              placeholder="Enter notebook title..."
              className="w-full px-4 py-2 rounded-xl bg-zinc-50 dark:bg-gray-700 
                       border border-zinc-200 dark:border-gray-600
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 
                       focus:border-indigo-500 dark:focus:border-indigo-400
                       text-zinc-800 dark:text-zinc-100 mb-4
                       placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              autoFocus
            />
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewNotebookTitle('');
                }}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 
                         hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                onClick={createNotebook}
                className="px-4 py-2 bg-indigo-500 dark:bg-indigo-600 text-white rounded-xl 
                         hover:bg-indigo-600 dark:hover:bg-indigo-500 
                         transition-colors text-sm font-medium shadow-sm hover:shadow-md"
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Notebook'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Library;