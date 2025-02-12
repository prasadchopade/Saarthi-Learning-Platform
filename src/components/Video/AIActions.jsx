import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoltLightning,
  faBrain,
  faChevronRight,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const AIActions = ({ 
  isGeneratingNotes, 
  onGenerateSmartNotes, 
  disabled = false 
}) => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 shadow-sm border border-indigo-100/50 dark:border-indigo-500/20">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <FontAwesomeIcon icon={faBoltLightning} className="text-indigo-500" />
        AI Learning Assistant
      </h3>
      <div className="space-y-2">
        <button 
          onClick={onGenerateSmartNotes}
          disabled={isGeneratingNotes || disabled}
          className={`w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg 
                    ${isGeneratingNotes || disabled ? 'opacity-80 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-500">
              {isGeneratingNotes ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faBrain} />
              )}
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {isGeneratingNotes ? 'Generating Notes...' : 'Generate Smart Notes'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Get direct summary and key points from the video
              </div>
            </div>
          </div>
          <FontAwesomeIcon icon={faChevronRight} className="text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default AIActions;
