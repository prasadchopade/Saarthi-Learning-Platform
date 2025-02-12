import { motion } from "framer-motion";
import { Link as ScrollLink } from 'react-scroll';
import { lazy, Suspense } from 'react';
import {Login} from '../../services/authService';
const TypeAnimation = lazy(() => import('react-type-animation').then(module => ({ 
  default: module.TypeAnimation 
})));
import LightRays from '../background/LightRays';

export default function Hero() {

    const { googleLogin } = Login();
    
    return (
        <motion.section
            id="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative h-screen flex flex-col items-center justify-center bg-black will-change-transform"
        >
            <div style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0 }}>
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#ffffff"
                    raysSpeed={1.5}
                    lightSpread={0.9}
                    rayLength={1.5}
                    followMouse={true}
                    mouseInfluence={0}
                    noiseAmount={0.3}
                    distortion={0.05}
                    className="custom-rays"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mb-4"
                    >
                        <p className="text-lg sm:text-xl md:text-2xl font-medium text-white font-['Poppins'] tracking-wide">
                            Learn in a whole new way with us
                        </p>
                    </motion.div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl text-white font-display pb-4" style={{ contentVisibility: 'auto' }}>
                        Your<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 font-semibold"> AI-enabled</span> Learning Platform
                    </h1>

                    <p className="mt-6 text-base sm:text-lg md:text-xl text-white max-w-2xl mx-auto font-['Inter'] pl-4">
                        Do more than just watching lectures,{' '}
                        <span className="inline-block text-left">
                            <span className="inline-block w-[185px]">
                                <Suspense fallback={<span className="text-transparent bg-clip-text bg-purple-600 font-semibold">generate lectures!</span>}>
                                    <TypeAnimation
                                        sequence={[
                                            'generate lectures!',
                                            3000,
                                            'get smart notes!',
                                            3000,
                                            'analyse code!',
                                            3000,
                                            'clearify doubts!',
                                            3000,
                                            'get roadmaps!',
                                            3000,
                                        ]}
                                        wrapper="span"
                                        omitDeletionAnimation={true}
                                        speed={60}
                                        repeat={Infinity}
                                        className="text-transparent bg-clip-text bg-purple-600 font-semibold"
                                    />
                                </Suspense>
                            </span>
                        </span>
                    </p>


                    <div className=" flex justify-center">

                        <motion.button
                            onClick={googleLogin}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-4 mt-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 font-['Poppins']"
                        >
                            Get Started
                        </motion.button>
                    </div>
                </motion.div>
            </div>

        </motion.section>
    );
}