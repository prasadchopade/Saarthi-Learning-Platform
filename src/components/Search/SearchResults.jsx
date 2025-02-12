import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import VideoCard from '../Common/VideoCard';

const SearchResults = ({ videos, loading, onVideoSelect }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <FontAwesomeIcon icon={faSpinner} className="text-3xl text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 font-medium">No videos found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {videos.map((video) => {
        return (
        <VideoCard
          key={video.id}
          video={video}
          onVideoSelect={onVideoSelect}
        />
      );
      })}
    </div>
  );
};

export default SearchResults;
