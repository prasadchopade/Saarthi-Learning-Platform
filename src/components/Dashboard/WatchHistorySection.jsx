import React from "react";
import VideoCard from "../Common/VideoCard";

const WatchHistorySection = ({ watchHistory, onVideoSelect }) => {
  if (!watchHistory || watchHistory.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-indigo-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          Continue Watching
        </h2>
      </div>
      <div className="flex space-x-5 overflow-x-auto pb-6 no-scrollbar">
        {watchHistory.map((video) => (
          <div key={video.videoId} className="w-72 flex-shrink-0">
            <VideoCard 
              video={{
                id: video.videoId,
                title: video.title,
                thumbnail: { thumbnails: [{ url: video.thumbnail }] },
                channelTitle: video.channelTitle,
                length: video.length
              }} 
              onVideoSelect={onVideoSelect} 
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default WatchHistorySection;