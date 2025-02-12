import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const VideoPlayer = ({ videoId, title, onBack }) => {
  return (
    <div className="space-y-6">
      {/* Back Button and Title */}
      <div className="sticky top-0 z-10 bg-zinc-50/90 dark:bg-gray-900/90 backdrop-blur-sm p-4 border-b border-zinc-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
            {title}
          </h1>
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Video Player */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-white dark:bg-gray-800 
                      shadow-md border border-zinc-100 dark:border-gray-700">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video Player"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
