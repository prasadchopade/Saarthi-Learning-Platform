import api, { setAuthToken, clearAuthToken, getAuthToken } from "./api";
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';

export const logout = async () => {
  try {
    await api.post("/googleauth/logout");
  } catch (error) {
    // Logging out locally matters even if the request fails.
  } finally {
    clearAuthToken();
    localStorage.removeItem('user-info');
  }
};

export const isAuthenticated = async () => {
  try {
    const response = await api.get("/googleauth/isAuthenticated");
  return response.data.isAuthenticated;
  } catch (error) {
    console.error('Error while checking authentication: ', error);
    return false;
  }
};

export const Login = () => {
  const navigate = useNavigate();

  // Google authorization codes are single use. This callback can fire more
  // than once for the same code, and every exchange after the first fails,
  // which surfaced as an "internal server error" on an otherwise fine login.
  const exchangedCode = useRef(null);

  const responseGoogle = async (authResult) => {
    const code = authResult && authResult.code;
    if (!code || exchangedCode.current === code) return;
    exchangedCode.current = code;

    try {
      {
        const result = await api.get(`/googleauth/login?code=${code}`);

        // Without a token every later request is unauthenticated, and the user
        // gets silently bounced back here by the route guard. Fail loudly.
        if (!result.data?.token) {
          throw new Error('The server did not return a session token.');
        }

        setAuthToken(result.data.token);
        const { name, image } = result.data.user;
        const userInfo = { name, image };
        localStorage.setItem('user-info', JSON.stringify(userInfo));
        navigate('/for-me');
      }
    } catch (err) {
      // Allow a retry: this code is spent, but the next attempt gets a new one.
      exchangedCode.current = null;

      const data = (err.response && err.response.data) || {};

      if (data.action === 'waitlist') {
        window.location.hash = 'waitlist';
        document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
        toast.success('Please join our waitlist to get access');
      } else {
        toast.error(data.message || err.message || 'Could not sign you in. Please try again.');
        console.error('Error while requesting google code: ', err);
      }
    }
  };

  // onError receives an error, not an auth result. Pointing it at the success
  // handler meant genuine sign-in failures were swallowed silently.
  const handleLoginError = (error) => {
    console.error('Google sign-in failed:', error);
    toast.error('Google sign-in failed. Please try again.');
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: handleLoginError,
    flow: 'auth-code'
  });

  return { googleLogin };
};


