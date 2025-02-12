import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVideo,
  faPersonChalkboard,
} from '@fortawesome/free-solid-svg-icons';

const OutputTypeSelector = ({ selectedType, onSelect }) => {
  const outputTypes = [
    { id: 'video', icon: faVideo, label: 'Video Lesson', disabled: true, comingSoon: true },
    { id: 'presentation', icon: faPersonChalkboard, label: 'Presentation' }
  ];

  return (
    <div className="flex flex-wrap gap-3 md:gap-4 justify-center mb-6">
      {outputTypes.map((type) => (
        <motion.button
          key={type.id}
          onClick={() => !type.disabled && onSelect(type.id)}
          disabled={type.disabled}
          className={`flex flex-col items-center p-4 rounded-xl transition-all relative ${type.disabled
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
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Coming Soon
            </span>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default OutputTypeSelector;
