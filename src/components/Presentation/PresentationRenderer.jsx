import React, { useState, useEffect, useRef } from 'react';
import SlideRenderer from './SlideRenderer';
import SlideControls from './SlideControls';
import SlideAudioPlayer from './SlideAudioPlayer';
import VoiceSelector from './VoiceSelector';

/**
 * Main presentation renderer component
 * Handles slide navigation and presentation state
 */
const PresentationRenderer = ({ presentation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState({
    name: 'en-IN-Neural2-A',
    languageCode: 'en-IN',
    ssmlGender: 'FEMALE',
    displayName: 'English (India) - Female'
  });
  const [translatedText, setTranslatedText] = useState('');

  // Get current slide data
  const currentSlide = presentation?.slides?.[currentSlideIndex] || null;
  const totalSlides = presentation?.slides?.length || 0;

  // Navigation handlers
  const goToNextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // Handle audio completion and slide transitions
  const handleAudioEnd = () => {
    if (currentSlideIndex < totalSlides - 1) {
      goToNextSlide();
    } else {
      setIsPlaying(false); // Stop playing when reaching the end
    }
  };
  
  // Reset translated text when slide changes
  useEffect(() => {
    setTranslatedText('');
  }, [currentSlideIndex]);

  // If no presentation data is provided
  if (!presentation || !presentation.slides || presentation.slides.length === 0) {
    return <div className="text-center text-gray-500">No presentation data available</div>;
  }

  return (
    <div className="presentation-container h-full w-full">
      <div className="h-full w-full flex flex-col border border-zinc-700">
        {/* Slide display area */}
        <div className="flex-1 bg-black flex items-center bg-white justify-center" style={{ height: '450px', width: '100%' }}>
          {currentSlide && (
            <div className=" h-full w-fit flex items-center justify-center">
              <SlideRenderer 
                slide={currentSlide} 
                slideIndex={currentSlideIndex}
              />
            </div>
          )}
        </div>
        
        {/* Transcript area */}
        {currentSlide && currentSlide.transcript && (
          <div className="dark:bg-zinc-800 bg-zinc-100 p-3 border-t border-zinc-700 h-[80px] no-scrollbar overflow-y-auto">
            <p className="text-sm text-zinc-900 dark:text-zinc-100 italic">
              {/* Show translated text if available, otherwise show original transcript */}
              {translatedText || currentSlide.transcript}
            </p>
            <SlideAudioPlayer
              transcript={currentSlide.transcript}
              audio={currentSlide.audio}
              isPlaying={isPlaying}
              onAudioEnd={handleAudioEnd}
              slideIndex={currentSlideIndex}
              presentationId={presentation._id}
              autoPlay={isPlaying}
              voice={selectedVoice}
              setTranslatedText={setTranslatedText}
            />
          </div>
        )}

        {/* Slide controls */}
        <div className="bg-zinc-900 border-t border-zinc-800">
          <SlideControls
            currentSlide={currentSlideIndex + 1}
            totalSlides={totalSlides}
            onPrevious={goToPrevSlide}
            onNext={goToNextSlide}
            setIsPlaying={setIsPlaying}
            isPlaying={isPlaying}
            selectedVoice={selectedVoice}
            onVoiceChange={setSelectedVoice}
          />
        </div>
      </div>
    </div>
  );
};

export default PresentationRenderer;
