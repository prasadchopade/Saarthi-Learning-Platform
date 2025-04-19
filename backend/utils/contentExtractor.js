const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { getTranscriptStatus, initiateTranscriptProcessing } = require('../services/transcriptService');
const youtubeService = require('../services/youtubeService');
// pdf-parse costs about 36MB of RSS; required on first use instead.
const pdfParse = (...args) => require('pdf-parse')(...args);

/**
 * Extract content from a YouTube URL
 * Gets video title and transcript
 * @param {string} youtubeUrl - YouTube video URL or ID
 * @returns {Promise<string>} - Video title and transcript content
 */
const extractYoutubeContent = async (youtubeUrl) => {
  try {
    // Extract video ID from URL
    const videoId = extractYoutubeVideoId(youtubeUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL or ID');
    }

    // Get video details for title
    const videoDetails = await youtubeService.getVideoDetails(videoId);
    const videoTitle = videoDetails?.title || 'YouTube Video';

    // Check if transcript is already processed
    let status = await getTranscriptStatus(videoId);
    
    // If not processed, initiate processing
    if (status.status !== 'exists') {
      await initiateTranscriptProcessing(videoId);
      
      // Wait for processing to complete (with timeout)
      const maxAttempts = 10;
      let attempts = 0;
      
      while (attempts < maxAttempts) {
        status = await getTranscriptStatus(videoId);
        if (status.status === 'exists') {
          break;
        }
        
        // Wait 2 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 2000));
        attempts++;
      }
      
      if (status.status !== 'exists') {
        throw new Error('Failed to process video transcript in time');
      }
    }
    
    // Get transcript content from the Python service
    const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:5001';
    const response = await axios.get(`${PYTHON_SERVICE_URL}/api/videos/${videoId}/transcript`);
    
    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Failed to retrieve transcript');
    }
    
    const transcript = response.data.transcript || '';
    
    // Combine title and transcript
    return `Title: ${videoTitle}\n\nTranscript:\n${transcript}`;
  } catch (error) {
    console.error('Error extracting YouTube content:', error);
    throw new Error(`Failed to extract YouTube content: ${error.message}`);
  }
};

/**
 * Extract video ID from YouTube URL
 * @param {string} url - YouTube URL or ID
 * @returns {string|null} - YouTube video ID or null if invalid
 */
const extractYoutubeVideoId = (url) => {
  // If it's already just an ID (11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }
  
  // Regular YouTube URL patterns
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Extract content from a PDF file
 * @param {Object} file - PDF file object with path or buffer
 * @param {number} startPage - Starting page number (1-based)
 * @param {number} endPage - Ending page number (1-based)
 * @returns {Promise<string>} - Extracted text content
 */
const extractPdfContent = async (file, startPage = 1, endPage = null) => {
  try {
    let dataBuffer;
    
    // Handle different file input types
    if (Buffer.isBuffer(file)) {
      // If file is already a buffer
      dataBuffer = file;
    } else if (typeof file === 'string') {
      // If file is a path string
      dataBuffer = fs.readFileSync(file);
    } else if (file.path) {
      // If file is an uploaded file object with path
      dataBuffer = fs.readFileSync(file.path);
    } else if (file.buffer) {
      // If file is an uploaded file object with buffer
      dataBuffer = file.buffer;
    } else {
      throw new Error('Invalid PDF file format');
    }
    
    // Parse PDF
    const pdfData = await pdfParse(dataBuffer);
    
    // Validate page numbers
    const totalPages = pdfData.numpages;
    startPage = Math.max(1, startPage || 1);
    endPage = endPage ? Math.min(totalPages, endPage) : totalPages;
    
    if (startPage > totalPages || startPage > endPage) {
      throw new Error('Invalid page range');
    }
    
    // Extract text from the full PDF
    const fullText = pdfData.text;
    
    // If we need the entire document
    if (startPage === 1 && endPage === totalPages) {
      return fullText;
    }
    
    // For partial extraction, we need to split by pages
    // This is a simplified approach as pdf-parse doesn't provide direct page-by-page extraction
    // For more accurate page extraction, consider using a more advanced library like pdf.js
    
    // Split text by page breaks (approximate)
    const textLines = fullText.split('\n');
    const linesPerPage = Math.ceil(textLines.length / totalPages);
    
    // Extract lines for the requested page range
    const startLine = (startPage - 1) * linesPerPage;
    const endLine = endPage * linesPerPage;
    
    const extractedLines = textLines.slice(startLine, endLine);
    return extractedLines.join('\n');
    
  } catch (error) {
    console.error('Error extracting PDF content:', error);
    throw new Error(`Failed to extract PDF content: ${error.message}`);
  }
};

module.exports = {
  extractYoutubeContent,
  extractPdfContent,
  extractYoutubeVideoId
};
