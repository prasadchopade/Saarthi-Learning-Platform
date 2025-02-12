import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faCode,
  faKeyboard,
  faRotateRight,
  faRobot
} from '@fortawesome/free-solid-svg-icons';

const languageOptions = [
  { id: 63, name: "JavaScript" },
  { id: 71, name: "Python" },
  { id: 50, name: "C" },
  { id: 105, name: "C++" },
  { id: 62, name: "Java" }
];

const EditorHeader = ({ 
  language, 
  setLanguage, 
  handleTabClick, 
  analyzeCode, 
  isAnalyzing, 
  clearCode, 
  executeCode, 
  loading 
}) => {
  return (
    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <FontAwesomeIcon icon={faCode} className="text-gray-500 dark:text-gray-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(Number(e.target.value))}
            className="bg-transparent text-sm font-medium text-gray-900 dark:text-gray-300 focus:outline-none cursor-pointer"
            style={{
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
              paddingRight: '2.5rem',
            }}
          >
            {languageOptions.map((lang) => (
              <option key={lang.id} value={lang.id} className="bg-white p-1 dark:bg-gray-800 text-gray-900 dark:text-gray-300">
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleTabClick('input')}
          className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <FontAwesomeIcon icon={faKeyboard} className="mr-2" />
          Input
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={analyzeCode}
          disabled={isAnalyzing}
          className={`px-3 py-1.5 text-sm font-medium ${isAnalyzing
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            } rounded-lg transition-colors`}
        >
          <FontAwesomeIcon icon={faRobot} className="mr-2" />
          {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={clearCode}
          className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <FontAwesomeIcon icon={faRotateRight} className="mr-2" />
          Clear
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={executeCode}
          disabled={loading}
          className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Running
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faPlay} />
              Run Code
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default EditorHeader;
