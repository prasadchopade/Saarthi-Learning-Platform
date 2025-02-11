const transcriptService = require('../services/transcriptService');
const presentationModel = require('../models/presentationModel');

exports.getChatHistory = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;
    const chatHistory = await transcriptService.manageChatSession(userId, videoId);
    res.json(chatHistory.messages);
  } catch (error) {
    console.error('Error getting chat history:', error);
    res.status(500).json({ error: 'Failed to get chat history' });
  }
};

exports.initializeVideoContext = async (req, res) => {
  try {
    const { videoId } = req.params;
    const result = await transcriptService.initiateTranscriptProcessing(videoId);
    res.json(result);
  } catch (error) {
    console.error('Error initializing video context:', error);
    res.status(500).json({ error: 'Failed to initialize video context' });
  }
};

exports.getVideoStatus = async (req, res) => {
  try {
    const { videoId } = req.params;    
    const status = await transcriptService.getTranscriptStatus(videoId);
    res.json(status);
  } catch (error) {
    console.error('Error getting video status:', error);
    res.status(500).json({ error: 'Failed to get video status' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { message } = req.body;
    const userId = req.user._id;
    
    const status = await transcriptService.getTranscriptStatus(videoId);
    if (status.status !== 'exists') {
      return res.status(400).json({ 
        error: 'Video transcript not ready',
        status: status.status,
        progress: status.message
      });
    }
    
    const chatSession = await transcriptService.manageChatSession(userId, videoId);
    
    let relevantSegments = [];
    try {
      relevantSegments = await transcriptService.semanticSearch(message, videoId) || [];
    } catch (error) {
      console.error('Error getting relevant segments:', error);
      relevantSegments = [];
    }
    
    const context = relevantSegments.length > 0
      ? relevantSegments
          .map(segment => {
            const text = segment.payload?.text || segment.text || "";
            const start = segment.payload?.start || segment.start || 0;
            const timestamp = transcriptService.formatTimestamp(start);
            return `[${timestamp}] ${text}`;
          })
          .join('\n\n')
      : 'No relevant transcript segments found.';
    
    const model = await transcriptService.getGeminiModel(userId);
    
    const conversationHistory = (chatSession.messages || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content || "" }]
    }));
    
    const chat = model.startChat({
      history: conversationHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ],
    });
    
    const result = await chat.sendMessage([{
      text: `You are an chatbot assistant helping a student with a youtube video and talking to him like a friendly tutor.

### YOUTUBE VIDEO TRANSCRIPT CONTEXT ###
${context || 'No context available from the video'}
### END OF CONTEXT ###

INSTRUCTIONS:
1. Response should be in a friendly tone—clear, patient, and encouraging.
2. Format your response using proper markdown:
   - Use **bold** for emphasis
   - Use proper headings with # for titles
   - Format code snippets with triple backticks and language specification
   - Use bullet points and numbered lists where appropriate
   - Use > for quotes
3. If the transcript doesn't directly address the question or chat from user:
   - Provide a general explanation that builds on the video's concepts
   - Dont mention about using the transcript or context in your response
4. For complex concepts:
   - break them down step-by-step
   - Use simple examples when helpful
   - Connect to foundational principles
   - Explain terminology that might be unfamiliar

The goal is to help the student truly understand the material, not just provide answers but be a companion while he study.

STUDENT'S MESSAGE: "${message}"
`
    }]);
    
    const aiResponse = result.response.text();
    const contextSegments = relevantSegments.length > 0
      ? relevantSegments.map(segment => ({
          text: segment.payload?.text || segment.text || "",
          start: segment.payload?.start || segment.start || 0,
          duration: segment.payload?.duration || segment.duration || 0
        }))
      : [];

    const userMessage = { 
      role: 'user', 
      content: message,
      timestamp: new Date()
    };
    
    const assistantMessage = { 
      role: 'assistant', 
      content: aiResponse,
      timestamp: new Date(),
      context: contextSegments
    };

    await transcriptService.manageChatSession(userId, videoId, {
      messages: [userMessage, assistantMessage]
    });

    res.json({
      message: aiResponse,
      context: contextSegments
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
};

exports.initializePresentationContext = async (req, res) => {
  try {
    const { presentationId } = req.params;
    const userId = req.user._id;
    const chatSession = await transcriptService.managePresentationChatSession(userId, presentationId);
    res.json({ success: true, message: 'Presentation context initialized' });
  } catch (error) {
    console.error('Error initializing presentation context:', error);
    res.status(500).json({ error: 'Failed to initialize presentation context' });
  }
};

exports.getPresentationChatHistory = async (req, res) => {
  try {
    const { presentationId } = req.params;
    const userId = req.user._id;
    const chatSession = await transcriptService.managePresentationChatSession(userId, presentationId);
    res.json(chatSession.messages || []);
  } catch (error) {
    console.error('Error getting presentation chat history:', error);
    res.status(500).json({ error: 'Failed to get presentation chat history' });
  }
};

exports.sendPresentationMessage = async (req, res) => {
  try {
    const { presentationId } = req.params;
    const { message } = req.body;
    const userId = req.user._id;
    
    const chatSession = await transcriptService.managePresentationChatSession(userId, presentationId);
    const presentation = await presentationModel.findById(presentationId).select('title slides');
    if (!presentation) {
      return res.status(404).json({ error: 'Presentation not found' });
    }
    
    const presentationTitle = presentation.title || 'Untitled Presentation';
    const presentationContent = presentation.slides || [];
    
    const slideContents = presentationContent.map((slide, index) => {
      return `${slide.content || ''}`;
    }).join('\n\n');
    
    const model = await transcriptService.getGeminiModel(userId);
    
    const conversationHistory = (chatSession.messages || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content || "" }]
    }));
    
    const chat = model.startChat({
      history: conversationHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ],
    });
    
    const result = await chat.sendMessage([{
      text: `You are an smartchatbot assistant talking to a student about a presentation like a friendly tutor. The student is learning from a presentation titled "${presentationTitle}".

### PRESENTATION CONTENT ###
${slideContents}
### END OF CONTENT ###

INSTRUCTIONS:
1. Use the presentation content to answer the question.
2. If the content doesn't directly address the question, provide a general explanation based on the presentation's topic.
3. Response should be in a friendly tone—clear, patient, and encouraging.
4. Format your response using proper markdown:
   - Use **bold** for emphasis
   - Use proper headings with # for titles
   - Format code snippets with triple backticks and language specification
   - Use bullet points and numbered lists where appropriate
   - Use > for quotes
5. For complex concepts:
   - break them down step-by-step
   - Use simple examples when helpful
   - Connect to foundational principles
   - Explain terminology that might be unfamiliar

The goal is to help the student truly understand the material, not just provide answers but be a companion while they study.

STUDENT'S MESSAGE: "${message}"
`
    }]);
    
    const aiResponse = result.response.text();

    const userMessage = { 
      role: 'user', 
      content: message,
      timestamp: new Date()
    };
    
    const assistantMessage = { 
      role: 'assistant', 
      content: aiResponse,
      timestamp: new Date()
    };

    await transcriptService.managePresentationChatSession(userId, presentationId, {
      messages: [userMessage, assistantMessage]
    });

    res.json({
      message: aiResponse
    });
  } catch (error) {
    console.error('Error sending presentation message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
};