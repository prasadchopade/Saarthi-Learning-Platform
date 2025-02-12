import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faCode,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const WorkspaceTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'notebook', label: 'Notes', icon: faBookOpen, color: 'from-violet-500 to-purple-500' },
    { id: 'code', label: 'Code', icon: faCode, color: 'from-blue-500 to-cyan-500' },
    { id: 'chat', label: 'AI Chat', icon: faRobot, color: 'from-emerald-500 to-teal-500' }
  ];

  return (
    <div className="px-4 py-2 border-b border-zinc-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative group px-4 py-2 rounded-xl transition-all duration-200
                      flex items-center gap-2 ${
                        activeTab === tab.id
                          ? 'text-white shadow-sm'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
          >
            {activeTab === tab.id && (
              <motion.div
                className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tab.color}`}
                layoutId="activeTab"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <FontAwesomeIcon icon={tab.icon} className="text-sm" />
              <span className="text-sm font-medium">{tab.label}</span>
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default WorkspaceTabs;
