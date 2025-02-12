import { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faCircleNotch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { addToWaitlist } from '../../services/waitlistService';
import { toast } from 'react-hot-toast';

const Waitlist = () => {
  const [status, setStatus] = useState('idle');
  const [email, setEmail] = useState('');

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  useEffect(() => {
    if (status === 'error') {
      const timer = setTimeout(() => {
        setStatus('idle');
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [status]);

  
  
  const handleClick = async () => {
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      await addToWaitlist(email);
      setStatus('success');
      toast.success('You are on the waitlist!');
    } catch (error) {
      setStatus('error');
      const message = error?.response?.data?.message || error?.message || 'An error occurred. Please try again.';
      toast.error(message);
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.98 },
  };

  return (
    <div className="bg-black relative mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:py-32 min-h-[50vh] md:h-screen flex flex-col justify-center items-center">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80" />

      <motion.h1
        className="relative z-10 text-4xl md:text-6xl p-2 bg-clip-text text-transparent text-white font-semibold font-['Poppins'] leading-tight tracking-tight text-center mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        Join the waitlist
      </motion.h1>

      <motion.p
        className="text-gray-300 max-w-2xl mx-auto mb-12 text-lg md:text-xl text-center relative z-10 leading-relaxed font-['Inter']"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Experience Saarthi's AI-powered learning platform that adapts to your unique needs. Transform your educational journey and unlock your full potential.
      </motion.p>

      <div className="relative z-10 flex flex-col sm:flex-row items-center w-full max-w-lg gap-4 px-4">
        <motion.input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-6 py-4 text-lg rounded-full bg-white/10 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />

        <motion.button
          className="w-full sm:w-auto px-4 py-2 rounded-full  text-white font-medium text-xl shadow-lg hover:shadow-purple-600/40 transition-all duration-300"
          onClick={handleClick}
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
        >
          {status === 'loading' && (
            <FontAwesomeIcon icon={faCircleNotch} spin className="h-5 w-5" />
          )}
          {status === 'success' && (
            <FontAwesomeIcon icon={faCheck} className="h-5 w-5" />
          )}
          {status === 'error' && (
            <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
          )}
          {status === 'idle' && (
            <FontAwesomeIcon icon={faArrowRight} className="h-6 w-6" />
          )}
        </motion.button>
      </div>

      
    </div>
  );
};

export default Waitlist;