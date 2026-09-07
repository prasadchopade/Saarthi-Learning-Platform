import api from './api';

/**
 * Service for handling Text-to-Speech operations
 * Uses Google Cloud Text-to-Speech API via backend
 */
const ttsService = {
  /**
   * Convert text to speech and get audio URL
   * @param {string} text - Text to convert to speech
   * @param {Object} options - TTS options
   * @param {string} options.voice - Voice name (default: 'en-US-Neural2-A')
   * @param {string} options.languageCode - Language code (default: 'en-US')
   * @param {string} options.ssmlGender - Gender (default: 'FEMALE')
   * @param {string} options.presentationId - ID of the presentation (optional)
   * @param {number} options.slideIndex - Index of the slide (optional)
   * @returns {Promise<Object>} - Object containing URL and key to the generated audio file
   */
  textToSpeech: async (text, options = {}) => {
    try {
      const defaultOptions = {
        voice: 'en-US-Neural2-A',
        languageCode: 'en-US',
        ssmlGender: 'MALE',
      };

      const mergedOptions = { ...defaultOptions, ...options };
      
      // If the language is not English, translate the text first
      let processedText = text;
      if (mergedOptions.languageCode !== 'en-US' && mergedOptions.languageCode !== 'en-IN') {
        try {
          // Extract language code (e.g., 'hi' from 'hi-IN')
          const targetLanguage = mergedOptions.languageCode.split('-')[0];
          const translatedText = await ttsService.translateText(text, targetLanguage);
          processedText = translatedText;
        } catch (translationError) {
          console.error('Translation failed, using original text:', translationError);
          // Continue with original text if translation fails
        }
      }
      
      const response = await api.post('/tts/convert', {
        text: processedText,
        voice: mergedOptions.voice,
        languageCode: mergedOptions.languageCode,
        ssmlGender: mergedOptions.ssmlGender,
        presentationId: mergedOptions.presentationId,
        slideIndex: mergedOptions.slideIndex,
      });
      
      return {
        url: response.data.audioUrl,
        translatedText: processedText
      };
    } catch (error) {
      console.error('Error converting text to speech:', error);
      throw error;
    }
  },

  /**
   * Get available voices for TTS
   * @returns {Promise<Array>} - Array of available voices
   */
  
  /**
   * Translate text to target language
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code (e.g., 'hi', 'bn', 'ta')
   * @returns {Promise<string>} - Translated text
   */
  translateText: async (text, targetLanguage) => {
    try {
      const response = await api.post('/tts/translate', {
        text,
        targetLanguage
      });
      return response.data.translatedText;
    } catch (error) {
      console.error('Error translating text:', error);
      throw error;
    }
  }
};

export default ttsService;
