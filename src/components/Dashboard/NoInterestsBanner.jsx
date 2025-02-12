import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const NoInterestsBanner = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 
               rounded-xl p-4 shadow-sm border border-blue-100 dark:border-blue-800/40"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-800/40 text-blue-500 dark:text-blue-400">
          <FontAwesomeIcon icon={faUser} className="text-lg" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            Personalize your learning experience
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Add your interests to get customized content recommendations and a personalized learning path.
          </p>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 
                    text-white rounded-lg text-sm font-medium transition-colors"
          >
            <span>Set up your profile</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default NoInterestsBanner;
