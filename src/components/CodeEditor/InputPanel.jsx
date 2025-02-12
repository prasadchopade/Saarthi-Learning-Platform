import React from "react";
import { motion } from "framer-motion";

const InputPanel = ({ stdin, setStdin }) => {
  return (
    <motion.div
      key="input"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full"
    >
      <textarea
        value={stdin}
        onChange={(e) => setStdin(e.target.value)}
        placeholder="Enter input values for your program..."
        className="w-full h-full p-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-mono text-sm resize-none"
      />
    </motion.div>
  );
};

export default InputPanel;
