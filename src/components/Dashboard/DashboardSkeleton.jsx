import React from "react";
import VideoCardSkeleton from "./VideoCardSkeleton";

const DashboardSkeleton = () => {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <section key={i} className="mb-8">
          <div className="h-8 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse w-48 mb-4" />
          <div className="flex space-x-5">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="w-72 flex-shrink-0">
                <VideoCardSkeleton />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default DashboardSkeleton;
