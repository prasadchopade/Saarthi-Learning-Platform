import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-2xl text-gray-600 mt-4">Page Not Found</p>
        <p className="text-gray-500 mt-2">The page you are looking for does not exist.</p>
        <Link to="/for-me" className="mt-6 inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
