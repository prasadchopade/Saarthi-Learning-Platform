import React from "react";
import VideoCard from "../Common/VideoCard";
import VideoCardSkeleton from "./VideoCardSkeleton";

const VideoSection = ({ title, videos, onVideoSelect, loading = false }) => {
  const scrollContainerRef = React.useRef(null);
  
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  return (
    <section className="mb-8 relative group">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white dark:bg-zinc-700 shadow-md hover:bg-gray-100"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white dark:bg-zinc-700 shadow-md hover:bg-gray-100"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex space-x-5 overflow-x-auto pb-6 no-scrollbar snap-x"
      >
        {loading || !videos ? (
          // Show skeleton cards when loading or no videos
          [...Array(4)].map((_, index) => (
            <div key={`skeleton-${index}`} className="w-72 flex-shrink-0 snap-start">
              <VideoCardSkeleton />
            </div>
          ))
        ) : videos.length > 0 ? (
          videos.map((video) => (
            <div key={video.id} className="w-72 flex-shrink-0 snap-start">
              <VideoCard video={video} onVideoSelect={onVideoSelect} />
            </div>
          ))
        ) : (
          <div className="w-full text-center py-8 text-gray-500 dark:text-gray-400">
            No videos available for this topic
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoSection;
