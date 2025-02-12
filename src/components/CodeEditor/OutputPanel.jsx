import React from "react";
import { motion } from "framer-motion";

const OutputPanel = ({ output }) => {
  return (
    <motion.div
      key="output"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full"
    >
      <pre className="h-full p-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm overflow-auto">
        {output || "Run your code to see the output..."}
      </pre>
    </motion.div>
  );
};

export default OutputPanel;
