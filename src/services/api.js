import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

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
      // Network error - no response received
      toast.error('Network error. Please check your internet connection.');
    } else {
      // Other errors (e.g., request setup error)
      toast.error('An unexpected error occurred. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

export default api; 