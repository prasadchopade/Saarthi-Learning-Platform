import React from 'react';

const VideoDescription = ({ description, title, duration, views, uploadDate }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {title || 'Video Title'}
      </h1>
      
      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
        {views && (
          <span>{views} views</span>
        )}
        {uploadDate && (
          <span>{uploadDate}</span>
        )}
        {duration && (
          <span>{duration}</span>
        )}
      </div>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {description || 'No description available for this video.'}
        </p>
      </div>
    </div>
  );
};

export default VideoDescription;
