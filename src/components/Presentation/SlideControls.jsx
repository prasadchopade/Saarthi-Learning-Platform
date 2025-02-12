import React, { useState, useEffect } from 'react';
import { FaVolumeUp, FaVolumeOff } from 'react-icons/fa';
import VoiceSelector from './VoiceSelector';

/**
 * SlideControls component
 * Provides navigation controls for the presentation
 */
const SlideControls = ({ 
  currentSlide, 
  totalSlides, 
  onPrevious, 
  onNext, 
  isPlaying,
  setIsPlaying,
  selectedVoice,
  onVoiceChange
}) => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audioVolume, setAudioVolume] = useState(80);
  
  // Default voice if none is selected
  useEffect(() => {
    if (!selectedVoice) {
      // Set default to English (India) - Female
      onVoiceChange({
        name: 'en-IN-Neural2-A',
        languageCode: 'en-IN',
        ssmlGender: 'FEMALE',
        displayName: 'English (India) - Female'
      });
    }
  }, []);
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    setAudioVolume(newVolume);
    // Dispatch custom event to notify audio components
    window.dispatchEvent(new CustomEvent('presentation-audio-volume', { 
      detail: { volume: newVolume / 100 } 
    }));
  };
  return (
    <div className="slide-controls py-2 px-4 flex justify-between items-center">
      <div className="flex gap-2">
        {/* Previous slide button */}
        <button
          onClick={onPrevious}
          disabled={currentSlide <= 1}
          className={`p-2 rounded-full ${
            currentSlide <= 1 
              ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
              : 'bg-zinc-800 text-white hover:bg-zinc-700'
          }`}
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Play/Pause button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
          aria-label={isPlaying ? "Pause presentation" : "Play presentation"}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>

        {/* Next slide button */}
        <button
          onClick={onNext}
          disabled={currentSlide >= totalSlides}
          className={`p-2 rounded-full ${
            currentSlide >= totalSlides 
              ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
              : 'bg-zinc-800 text-white hover:bg-zinc-700'
          }`}
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <div className="flex items-center gap-2 w-32">
          <FaVolumeUp className="text-zinc-100 dark:text-zinc-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={audioVolume}
            onChange={handleVolumeChange}
            className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
            disabled={!audioEnabled}
          />
        </div>
        
      </div>

      <div className="flex items-center gap-4">
        {/* Voice selector */}
        <VoiceSelector 
          selectedVoice={selectedVoice}
          onVoiceChange={onVoiceChange}
        />
        
        {/* Slide counter */}
        <div className="text-zinc-400 text-sm">
          {currentSlide} / {totalSlides}
        </div>
      </div>
    </div>
  );
};

export default SlideControls;
