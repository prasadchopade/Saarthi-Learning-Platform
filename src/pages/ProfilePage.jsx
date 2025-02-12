import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import ProfileTabs from '../components/Profile/ProfileTabs';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    image: ''
  });
  const [activeTab, setActiveTab] = useState('api-key');

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem('user-info'));
    if (storedUserInfo) {
      setUserInfo({
        name: storedUserInfo.name || '',
        image: storedUserInfo.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(storedUserInfo.name || 'User')}`
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Profile Settings</h1>
        
        {/* Profile Section */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-8 mb-10">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative flex-shrink-0">
              {userInfo.image ? (
                <img 
                  src={userInfo.image} 
                  alt={userInfo.name} 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-indigo-100 dark:border-indigo-900/40"
                />
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="text-4xl text-indigo-500" />
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {userInfo.name || 'User'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                Welcome to your profile! Here you can manage your API key and interests to personalize your learning experience.
              </p>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <ProfileTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      </div>
    </div>
  );
};

export default ProfilePage;
