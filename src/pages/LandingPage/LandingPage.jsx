import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Hero from '../../components/LandingPage/Hero';
const Features = lazy(() => import('../../components/LandingPage/Features'));
const About = lazy(() => import('../../components/LandingPage/AboutUs'));
const Footer = lazy(() => import('../../components/Common/Footer'));
const Waitlist = lazy(() => import('../../components/LandingPage/Waitlist'));

const LandingPage = () => {
  return (
    <div>
      <motion.section
        id="hero"
      >
        <Hero />
      </motion.section>
      <Suspense fallback={<div className="h-screen bg-white flex items-center justify-center">Loading...</div>}>
        <motion.section
          id="about"
          className="bg-white"
        >
          <About />
        </motion.section>
      </Suspense>
      
      <Suspense fallback={<div className="h-screen bg-white flex items-center justify-center">Loading...</div>}>
        <motion.section
          id="features"
          className="bg-white"
        >
          <Features />
        </motion.section>
      </Suspense>
      
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
        <motion.section
          id="waitlist" 
        >
          <Waitlist />
        </motion.section>
      </Suspense>
      
      <Suspense fallback={<div className="h-24 bg-gray-900 flex items-center justify-center">Loading...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default LandingPage;
