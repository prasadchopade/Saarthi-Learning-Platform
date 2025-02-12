import React, { useEffect, useRef, useState } from 'react';
import ttsService from '../../services/ttsService';

/**
 * SlideAudioPlayer component
 * Handles audio playback for slide transcripts
 */
const SlideAudioPlayer = ({ 
  transcript, 
  audio,
  isPlaying, 
  onAudioEnd, 
  slideIndex,
  presentationId,
  autoPlay = true,
  voice,
  setTranslatedText
}) => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  const slideIndexRef = useRef(slideIndex);

  // Update slideIndexRef when slideIndex changes
  useEffect(() => {
    slideIndexRef.current = slideIndex;
  }, [slideIndex]);

  // Generate audio from transcript when component mounts or transcript changes
  useEffect(() => {
    const getAudio = async () => {
      // If direct audio URL is provided, use it
      if (audio) {
        setAudioUrl(audio);
        return;
      }
      
      
      if (!transcript) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await ttsService.textToSpeech(transcript, {
          presentationId,
          slideIndex,
          voice: voice?.name,
          languageCode: voice?.languageCode,
          ssmlGender: voice?.ssmlGender
        });
        
        setAudioUrl(result.url);
        
        // If there's translated text, pass it to parent component
        if (setTranslatedText && result.translatedText && result.translatedText !== transcript) {
          setTranslatedText(result.translatedText);
        } else if (setTranslatedText) {
          setTranslatedText('');
        }
      } catch (err) {
        console.error('Failed to generate audio:', err);
        setError('Failed to generate audio');
      } finally {
        setIsLoading(false);
      }
    };

    getAudio();
  }, [transcript, audio, presentationId, slideIndex, voice]);

  // Listen for audio control events
  useEffect(() => {
    const handleAudioToggle = (event) => {
      if (!audioRef.current) return;
      
      const { enabled } = event.detail;
      if (!enabled) {
        audioRef.current.pause();
      } else if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Failed to play audio:', err);
        });
      }
    };
    
    const handleVolumeChange = (event) => {
      if (!audioRef.current) return;
      
      const { volume } = event.detail;
      audioRef.current.volume = volume;
    };
    
    window.addEventListener('presentation-audio-toggle', handleAudioToggle);
    window.addEventListener('presentation-audio-volume', handleVolumeChange);
    
    return () => {
      window.removeEventListener('presentation-audio-toggle', handleAudioToggle);
      window.removeEventListener('presentation-audio-volume', handleVolumeChange);
    };
  }, [isPlaying]);
  
  // Control audio playback based on isPlaying prop
  useEffect(() => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Failed to play audio:', err);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, audioUrl]);

  // Handle audio end event
  const handleAudioEnd = () => {
    if (onAudioEnd) {
      onAudioEnd(slideIndexRef.current);
    }
  };

  return (
    <div className="slide-audio-player">
      {isLoading && <div className="text-xs text-zinc-400">Loading audio...</div>}
      {error && <div className="text-xs text-red-400">{error}</div>}
      
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={handleAudioEnd}
          autoPlay={autoPlay && isPlaying}
        />
      )}
    </div>
  );
};

export default SlideAudioPlayer;
