import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faHeart } from "@fortawesome/free-solid-svg-icons";
import ApiKeyManager from './ApiKeyManager';
import InterestsSection from './InterestsSection';

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-8">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('api-key')}
            className={`${
              activeTab === 'api-key'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <FontAwesomeIcon icon={faKey} />
            API Key Management
          </button>
          <button
            onClick={() => setActiveTab('interests')}
            className={`${
              activeTab === 'interests'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <FontAwesomeIcon icon={faHeart} />
            Interest Management
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'api-key' && (
          <div className="animate-fadeIn">
            <ApiKeyManager />
          </div>
        )}

        {activeTab === 'interests' && (
          <div className="animate-fadeIn">
            <InterestsSection />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;
