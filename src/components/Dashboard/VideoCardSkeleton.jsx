import React from "react";

const VideoCardSkeleton = () => (
  <div className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm h-full">
    {/* Thumbnail skeleton */}
    <div className="aspect-video bg-gray-200 dark:bg-zinc-700 animate-pulse" />
    
    {/* Content skeleton */}
    <div className="p-4">
      {/* Title skeleton */}
      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse w-2/3" />
      
      {/* Channel name skeleton */}
      <div className="mt-4 h-3 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse w-1/2" />
    </div>
  </div>
);

export default VideoCardSkeleton;
