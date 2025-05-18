import api, { setAuthToken, clearAuthToken, getAuthToken } from "./api";
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

  const responseGoogle = async (authResult) => {
    try {
      if (authResult['code']) {
        const result = await api.get(`/googleauth/login?code=${authResult['code']}`);
        setAuthToken(result.data.token);
        const { name, image } = result.data.user;
        const userInfo = { name, image };
        localStorage.setItem('user-info', JSON.stringify(userInfo));
        navigate('/for-me');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.action === 'waitlist') {
        window.location.hash = 'waitlist';
        document.getElementById('waitlist').scrollIntoView({ behavior: 'smooth' });
        toast.success('Please join our waitlist to get access');
      } else {
        toast.error(err.response.data.message);
        console.error('Error while requesting google code: ', err);
      }
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: 'auth-code'
  });

  return { googleLogin };
};


