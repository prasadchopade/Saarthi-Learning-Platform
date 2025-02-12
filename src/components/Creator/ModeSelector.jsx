import React from 'react';
import { motion } from 'framer-motion';

const ModeSelector = ({ selectedMode, onSelect }) => {
  const modes = [
    { id: 'exam_prep', label: 'Exam Prep', description: 'Focused on key concepts with practice questions' },
    { id: 'deep_learning', label: 'Deep Learning', description: 'Detailed explanations and comprehensive coverage' },
    { id: 'quick_summary', label: 'Quick Summary', description: 'Brief overview of the main points' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {modes.map((mode) => (
        <motion.div
          key={mode.id}
          onClick={() => onSelect(mode.id)}
          className={`p-4 rounded-xl cursor-pointer transition-all ${selectedMode === mode.id
              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500'
              : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
            }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <h3 className="font-medium mb-1">{mode.label}</h3>
          <p className="text-sm opacity-80">{mode.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default ModeSelector;
