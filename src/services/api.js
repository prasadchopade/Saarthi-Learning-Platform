import axios from 'axios';
import { toast } from 'react-hot-toast';

// Create axios instance with base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  // The API is on a free tier that sleeps when idle, and a cold start can take
  // the better part of a minute. Anything shorter than this aborts a request
  // that would actually have succeeded.
  timeout: 90000,
});

// Ask the API to wake up as early as possible, so the server is usually ready
// by the time someone finishes reading the landing page and signs in.
export const warmUpApi = () => {
  const base = API_BASE_URL.replace(/\/api\/?$/, '');
  return fetch(`${base}/health`, { mode: 'cors' }).catch(() => {});
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 400:
          // Bad Request - Validation errors
          const errorMessage = data?.message || data?.error || 'Invalid request data';
          toast.error(errorMessage);
          break;
          
        case 401:
          localStorage.removeItem('user');
          toast.error('Session expired. Please login again.');
          setTimeout(() => {
            console.log("Session expired. Please login again.");
          }, 4000);          
          window.location.href = '/';
          break;
          
        case 403:
          // Forbidden - Access denied
          toast.error('Access denied. You do not have permission to perform this action.');
          break;
          
        case 404:
          // Not Found
          toast.error('The requested resource was not found.');
          break;
          
        case 409:
          // Conflict - Resource already exists
          toast.error(data?.message || 'Resource already exists.');
          break;
          
        case 422:
          // Unprocessable Entity - Validation errors
          const validationErrors = data?.errors || data?.message || 'Validation failed';
          if (Array.isArray(validationErrors)) {
            validationErrors.forEach(err => toast.error(err));
          } else {
            toast.error(validationErrors);
          }
          break;
          
        case 429:
          // Too Many Requests - Rate limiting
          toast.error('Too many requests. Please try again later.');
          break;
          
        case 500:
          // Internal Server Error
          const serverError = data?.message || data?.error || 'Internal server error occurred';
          toast.error(serverError);
          break;
          
        case 502:
          // Bad Gateway
          toast.error('Service temporarily unavailable. Please try again later.');
          break;
          
        case 503:
          // Service Unavailable
          toast.error('Service is currently unavailable. Please try again later.');
          break;
          
        case 504:
          // Gateway Timeout
          toast.error('Request timeout. Please try again.');
          break;
          
        default:
          // Other errors
          const defaultError = data?.message || data?.error || `An error occurred (${status})`;
          toast.error(defaultError);
          break;
      }
    } else if (error.request) {
      // No response. On a sleeping free-tier server the first request after
      // idle times out while the container boots, so retry once before
      // blaming the user's connection.
      const config = error.config || {};
      if (!config.__retried) {
        config.__retried = true;
        toast.loading('Waking up the server, this can take up to a minute...', {
          id: 'cold-start',
        });
        return new Promise((resolve) => setTimeout(resolve, 3000))
          .then(() => api(config))
          .then((response) => {
            toast.dismiss('cold-start');
            return response;
          })
          .catch((retryError) => {
            toast.dismiss('cold-start');
            toast.error('Could not reach the server. Please try again in a moment.');
            return Promise.reject(retryError);
          });
      }
      toast.error('Could not reach the server. Please try again in a moment.');
    } else {
      // Other errors (e.g., request setup error)
      toast.error('An unexpected error occurred. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

export default api; 