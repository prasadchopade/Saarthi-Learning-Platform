const LessonCardSkeleton = () => {
    return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-video bg-gray-200 dark:bg-zinc-700" />
      <div className="p-4">
        <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-1/2" />
      </div>
    </div>
  );
};

export default LessonCardSkeleton;