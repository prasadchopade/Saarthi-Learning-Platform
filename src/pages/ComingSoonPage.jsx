const ComingSoonPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Coming Soon</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          We're working hard to bring you this feature. Good things take time!
        </p>
        <div className="w-24 h-1 bg-blue-500 dark:bg-blue-400 mx-auto mb-6"></div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
