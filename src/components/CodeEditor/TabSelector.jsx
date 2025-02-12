import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard, faTerminal, faRobot } from '@fortawesome/free-solid-svg-icons';

const TabSelector = ({ activeTab, setActiveTab, isAnalyzing, analyzeCode, aiAnalysis }) => {
  return (
    <div className="h-10 px-4 flex items-center gap-4 border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setActiveTab('input')}
        className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${activeTab === 'input'
            ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900 shadow-sm'
            : 'text-gray-900 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
      >
        <FontAwesomeIcon icon={faKeyboard} />
        Input
      </button>
      <button
        onClick={() => setActiveTab('output')}
        className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${activeTab === 'output'
            ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900 shadow-sm'
            : 'text-gray-900 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
      >
        <FontAwesomeIcon icon={faTerminal} />
        Output
      </button>
      <button
        onClick={() => {
          if (!aiAnalysis) {
            analyzeCode();
          }
          setActiveTab('analysis');
        }}
        className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${activeTab === 'analysis'
            ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900 shadow-sm'
            : 'text-gray-900 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
      >
        <FontAwesomeIcon icon={faRobot} />
        AI Analysis {isAnalyzing && <span className="ml-2 animate-pulse">•</span>}
      </button>
    </div>
  );
};

export default TabSelector;
