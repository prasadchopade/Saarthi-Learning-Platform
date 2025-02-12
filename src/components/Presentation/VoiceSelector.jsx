import React, { useState, useEffect } from 'react';
import ttsService from '../../services/ttsService';
import { FaMicrophone, FaGlobe } from 'react-icons/fa';
import api from '../../services/api';

/**
 * VoiceSelector component
 * Provides a dropdown to select TTS voice options for Indian languages
 */
const VoiceSelector = ({ selectedVoice, onVoiceChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  // Predefined Indian language voices
  const indianVoices = [
    { name: 'en-IN-Neural2-A', languageCode: 'en-IN', ssmlGender: 'FEMALE', displayName: 'English (India) - Female' },
    { name: 'en-IN-Neural2-B', languageCode: 'en-IN', ssmlGender: 'MALE', displayName: 'English (India) - Male' },
    { name: 'hi-IN-Neural2-A', languageCode: 'hi-IN', ssmlGender: 'FEMALE', displayName: 'Hindi - Female' },
    { name: 'hi-IN-Neural2-B', languageCode: 'hi-IN', ssmlGender: 'MALE', displayName: 'Hindi - Male' },
    { name: 'bn-IN-Wavenet-A', languageCode: 'bn-IN', ssmlGender: 'FEMALE', displayName: 'Bengali - Female' },
    { name: 'ta-IN-Wavenet-A', languageCode: 'ta-IN', ssmlGender: 'FEMALE', displayName: 'Tamil - Female' },
    { name: 'te-IN-Wavenet-A', languageCode: 'te-IN', ssmlGender: 'FEMALE', displayName: 'Telugu - Female' },
    { name: 'kn-IN-Wavenet-A', languageCode: 'kn-IN', ssmlGender: 'FEMALE', displayName: 'Kannada - Female' },
    { name: 'ml-IN-Wavenet-A', languageCode: 'ml-IN', ssmlGender: 'FEMALE', displayName: 'Malayalam - Female' },
    { name: 'gu-IN-Wavenet-A', languageCode: 'gu-IN', ssmlGender: 'FEMALE', displayName: 'Gujarati - Female' },
    { name: 'mr-IN-Wavenet-A', languageCode: 'mr-IN', ssmlGender: 'FEMALE', displayName: 'Marathi - Female' },
  ];

  // Function to translate text if needed
  const translateTextIfNeeded = async (text, targetLanguage) => {
    if (targetLanguage === 'en-IN') {
      return text;
    }
    
    setIsTranslating(true);
    try {
      // Extract just the language code part (e.g., 'hi' from 'hi-IN')
      const languageCode = targetLanguage.split('-')[0];
      
      // Call translation API (this would need to be implemented in the backend)
      const response = await api.post('/tts/translate', {
        text,
        targetLanguage: languageCode
      });
      
      return response.data.translatedText;
    } catch (error) {
      console.error('Translation failed:', error);
      return text; // Fallback to original text
    } finally {
      setIsTranslating(false);
    }
  };
  
  // Handle voice change with translation
  const handleVoiceChange = async (voice) => {
    // If the selected voice is not English, we might need to translate
    if (voice.languageCode !== 'en-IN') {
      // Inform the user that translation will happen
      // This is just a placeholder - you might want to implement a more sophisticated UI
      // to show translation status
    }
    
    onVoiceChange(voice);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-md bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
        disabled={isLoading}
      >
        <FaMicrophone />
        <span className="text-sm">
          {isLoading ? 'Loading voices...' : selectedVoice?.displayName || 'Select Voice'}
          {isTranslating && <span className="ml-2 text-yellow-400">(Translating...)</span>}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 right-0 w-64 max-h-60 overflow-y-auto bg-zinc-800 border border-zinc-700 rounded-md shadow-lg">
          <div className="sticky top-0 bg-zinc-900 text-xs text-zinc-400 px-3 py-2 border-b border-zinc-700 flex items-center">
            <FaGlobe className="mr-2" /> Indian Languages
          </div>
          {indianVoices.map((voice) => (
            <button
              key={voice.name}
              className={`w-full text-left px-3 py-1 text-sm hover:bg-zinc-700 ${
                selectedVoice?.name === voice.name ? 'bg-blue-600 text-white' : 'text-zinc-100'
              }`}
              onClick={() => {
                handleVoiceChange(voice);
                setIsOpen(false);
              }}
            >
              {voice.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceSelector;
