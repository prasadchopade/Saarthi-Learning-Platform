import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faVideo,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';

const InputTypeSelector = ({ selectedType, onSelect }) => {
  const inputTypes = [
    { id: 'topic', icon: faBook, label: 'Topic' },
    { id: 'youtube', icon: faVideo, label: 'YouTube' },
    { id: 'pdf', icon: faFilePdf, label: 'PDF', disabled: true, comingSoon: true }
  ];

  return (
    <div className="flex flex-wrap gap-3 md:gap-4 justify-center mb-6 w-full">
      {inputTypes.map((type) => (
        type.id === 'pdf' ? (
          <motion.button
            key={type.id}
            onClick={() => !type.disabled && onSelect(type.id)}
            disabled={type.disabled}
            className={`flex flex-col items-center p-4 rounded-xl transition-all relative w-24 h-24 ${type.disabled
              ? 'bg-gray-100 dark:bg-zinc-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
              : selectedType === type.id
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500'
                : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
            }`}
            whileHover={!type.disabled ? { scale: 1.03 } : {}}
            whileTap={!type.disabled ? { scale: 0.97 } : {}}
          >
            <FontAwesomeIcon icon={type.icon} className="text-xl mb-2" />
            <span className="text-sm font-medium">{type.label}</span>
            {type.comingSoon && (
              <span className="absolute -top-3 -right-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Coming Soon
              </span>
            )}
          </motion.button>
        ) : (
          <motion.button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`flex flex-col items-center p-4 rounded-xl transition-all w-24 h-24 ${selectedType === type.id
              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500'
              : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FontAwesomeIcon icon={type.icon} className="text-xl mb-2" />
            <span className="text-sm font-medium">{type.label}</span>
          </motion.button>
        )
      ))}
    </div>
  );
};

export default InputTypeSelector;