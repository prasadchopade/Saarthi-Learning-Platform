import React from "react";
import { motion } from "framer-motion";

const VideoCard = ({ video, onVideoSelect }) => {
  if (!video || !video.title) {
    return null;
  }
  console.log(video);
  const thumbnailUrl = video.thumbnail?.thumbnails?.[0]?.url || video.thumbnail?.high?.url;

  if (!thumbnailUrl) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg
               transition-all duration-300 cursor-pointer flex flex-col h-full"
      onClick={() => onVideoSelect(video.id, video.title, thumbnailUrl, video.channelTitle, video.length)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={thumbnailUrl}
          alt={video.title || 'Video thumbnail'} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {video.length && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded">
            {video.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-2">
          {video.title}
        </h3>

        <div className="mt-auto">
          <div className="text-sm text-gray-700 dark:text-gray-300 truncate mb-2">
            {video.channelTitle}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;
