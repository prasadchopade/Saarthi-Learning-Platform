import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { apiKeyService } from '../../services/apiKeyService';

const ApiKeyManager = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    fetchApiKey();
  }, []);

  const fetchApiKey = async () => {
    try {
      const apiKeyValue = await apiKeyService.getApiKey();
      setApiKey(apiKeyValue || '');
    } catch (error) {
      toast.error('Failed to fetch API key');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiKeyService.updateApiKey(apiKey);
      if (response.success) {
        toast.success('API key updated successfully');
      }
    } catch (error) {
      console.error('Error updating API key:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <FontAwesomeIcon icon={faKey} className="text-indigo-500" />
          Gemini API Key
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Enter your Gemini API key to enable AI features. You can get your API key from the{' '}
          <a
            href="https://makersuite.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            Google AI Studio
          </a>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="block w-full pl-4 pr-12 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-zinc-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                       placeholder-gray-400 dark:placeholder-gray-500
                       transition-colors"
              placeholder="Enter your Gemini API key"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 
                       dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
            >
              <FontAwesomeIcon icon={showKey ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg
                   text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 
                   dark:bg-indigo-500 dark:hover:bg-indigo-600
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save API Key'
          )}
        </button>
      </form>
    </div>
  );
};

export default ApiKeyManager; 