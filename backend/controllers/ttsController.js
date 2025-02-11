const textToSpeech = require('@google-cloud/text-to-speech');
const {Translate} = require('@google-cloud/translate').v2;
const { v4: uuidv4 } = require('uuid');
const { uploadFile, getPresignedUrl } = require('../services/s3Service');
const Presentation = require('../models/presentationModel');

// Create Google Cloud TTS client
const ttsClient = new textToSpeech.TextToSpeechClient({ keyFilename: './google_cloud_key.json'}
);

/**
 * Convert text to speech using Google Cloud TTS API
 * @route POST /api/tts/convert
 * @access Private
 */
exports.convertTextToSpeech = async (req, res) => {
  try {
    const { text, voice = 'en-US-Neural2-A', languageCode = 'en-US', ssmlGender = 'MALE', presentationId, slideIndex } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    // Configure TTS request
    const request = {
      input: { text },
      voice: {
        name: voice,
        languageCode,
        ssmlGender,
      },
      audioConfig: { audioEncoding: 'MP3' },
    };

    // Generate unique filename for the audio
    const fileName = `tts-${uuidv4()}.mp3`;
    
    // Perform text-to-speech conversion
    const [response] = await ttsClient.synthesizeSpeech(request);
    
    // Upload audio to S3
    const audioBuffer = response.audioContent;
    const s3Key = `tts/${req.user._id}/${fileName}`;
    
    await uploadFile(audioBuffer, 'audio/mpeg', s3Key);
    
    // Store the audio key in the presentation if presentationId and slideIndex are provided
    if (presentationId && slideIndex !== undefined) {
      const updateQuery = {};
      updateQuery[`slides.${slideIndex}.audioKey`] = s3Key;
      
      await Presentation.findByIdAndUpdate(
        presentationId,
        { $set: {
          'slides.${slideIndex}.audioKey': s3Key
        } }
      );
    }
    
    // Get signed URL for the uploaded audio
    const audioUrl = await getPresignedUrl(s3Key);
    
    res.status(200).json({
      success: true,
      audioUrl
    });
  } catch (error) {
    console.error('Error in TTS conversion:', error);
    res.status(500).json({
      message: 'Failed to convert text to speech',
      error: error.message
    });
  }
};

/**
 * Translate text to target language using Google Translate API
 * @route POST /api/tts/translate
 * @access Private
 */
exports.translateText = async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }
    
    if (!targetLanguage) {
      return res.status(400).json({ message: 'Target language is required' });
    }
    
    // Create a client
    const translate = new Translate({ keyFilename: './google_cloud_key.json' });
    
    // Translate text
    const [translation] = await translate.translate(text, targetLanguage);
    
    res.status(200).json({
      success: true,
      translatedText: translation
    });
  } catch (error) {
    console.error('Error translating text:', error);
    res.status(500).json({
      message: 'Failed to translate text',
      error: error.message
    });
  }
};