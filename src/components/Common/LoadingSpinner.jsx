import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-zinc-50 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-3">
        <FontAwesomeIcon icon={faSpinner} className="text-4xl text-indigo-600 animate-spin" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
