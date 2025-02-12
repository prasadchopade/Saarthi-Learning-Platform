import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';

const AnalysisPanel = ({ isAnalyzing, aiAnalysis, analyzeCode }) => {
  return (
    <motion.div
      key="analysis"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full"
    >
      <div className="h-full p-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg overflow-auto">
        {isAnalyzing ? (
          <div className="flex items-center gap-3 text-sm">
            <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <span>Analyzing your code... This may take a few seconds</span>
          </div>
        ) : aiAnalysis ? (
          <div className="prose dark:prose-invert max-w-full">
            <ReactMarkdown
              components={{
                h3: ({ node, ...props }) => (
                  <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-4 mb-2" {...props} />
                ),
                code: ({ node, inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="my-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {match[1].toUpperCase()}
                      </div>
                      <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 overflow-x-auto">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    <code className="bg-gray-100 dark:bg-gray-800 rounded px-1" {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {aiAnalysis}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3">
            <FontAwesomeIcon
              icon={faRobot}
              className="text-2xl text-gray-400 dark:text-gray-600"
            />
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              Click the AI Analysis button to get insights about your code.
              <br />
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Includes suggestions, optimizations, and best practices
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AnalysisPanel;
