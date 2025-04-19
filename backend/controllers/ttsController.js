const fs = require('fs');
const path = require('path');
// These two cost roughly 66MB of RSS between them and are only used by slide
// narration, so they are required on first use rather than at startup.
const loadTextToSpeech = () => require('@google-cloud/text-to-speech');
const loadTranslate = () => require('@google-cloud/translate').v2.Translate;
const { v4: uuidv4 } = require('uuid');
const { uploadFile, getPresignedUrl } = require('../services/s3Service');
const Presentation = require('../models/presentationModel');

// Google Cloud credentials come from GOOGLE_CLOUD_CREDENTIALS (the service
// account JSON, pasted as one line) so the app can be deployed without
// committing a key file. Locally you can still drop google_cloud_key.json in
// this folder instead.
//
// Both clients are built lazily: constructing them at module load meant a
// missing key file could take down the whole server on boot.
const getGoogleCloudOptions = () => {
  if (process.env.GOOGLE_CLOUD_CREDENTIALS) {
    return { credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS) };
  }
  if (fs.existsSync(path.join(__dirname, '..', 'google_cloud_key.json'))) {
    return { keyFilename: path.join(__dirname, '..', 'google_cloud_key.json') };
  }
  return null;
};

let ttsClient;
const getTtsClient = () => {
  if (!ttsClient) {
    const options = getGoogleCloudOptions();
    if (!options) return null;
    ttsClient = new (loadTextToSpeech().TextToSpeechClient)(options);
  }
  return ttsClient;
};

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
    const client = getTtsClient();
    if (!client) {
      return res.status(503).json({
        message: 'Text-to-speech is not configured on this server.',
      });
    }

    const [response] = await client.synthesizeSpeech(request);
    
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
    const translateOptions = getGoogleCloudOptions();
    if (!translateOptions) {
      return res.status(503).json({
        message: 'Translation is not configured on this server.',
      });
    }
    const Translate = loadTranslate();
    const translate = new Translate(translateOptions);
    
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