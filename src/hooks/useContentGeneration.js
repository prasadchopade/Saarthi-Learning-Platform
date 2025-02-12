import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import lessonService from '../services/lessonService';
import presentationService from '../services/presentationService';
import webhookService from '../services/webhookService';

const useContentGeneration = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState(null);

  const createContent = useCallback(async (inputData, outputType, learningMode) => {
    const { inputType, inputContent, selectedFile } = inputData;

    // Validate input
    if (inputType === 'topic' && !inputContent.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    if (inputType === 'youtube' && !inputContent.trim()) {
      const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
      if (!youtubeRegex.test(inputContent)) {
        toast.error('Please enter a valid YouTube URL');
        return;
      }
    }

    if (inputType === 'pdf' && !selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }
    
    // Validate PDF page range
    if (inputType === 'pdf' && (!inputData.pageRange || !inputData.pageRange.start || !inputData.pageRange.end)) {
      toast.error('Please select a page range');
      return;
    }
    
    if (inputType === 'pdf' && (inputData.pageRange.end - inputData.pageRange.start > 4)) {
      toast.error('Maximum 5 pages can be selected');
      return;
    }

    setIsGenerating(true);
    setGenerationStatus({ status: 'starting', message: 'Content generation started...' });

    try {
      let response;
      let contentId;
      let contentTitle;

      if (outputType === 'video') {
        // Prepare input data for lesson service
        const input = {
          type: inputType,
          content: inputContent,
          file: selectedFile,
          ...(inputType === 'pdf' && { pageRange: inputData.pageRange })
        };

        response = await lessonService.createLesson(input, learningMode);
        contentId = response.lessonId;
        contentTitle = inputType === 'topic' ? inputContent :
          inputType === 'youtube' ? 'YouTube Lesson' :
            selectedFile.name;

        toast.success('Lesson creation started! You\'ll be redirected when complete.');
      } else {
        // Prepare input data for presentation service
        const presentationData = {
          type: inputType,
          content: inputContent,
          mode: learningMode,
          file: selectedFile,
          ...(inputType === 'pdf' && { pageRange: inputData.pageRange })
        };

        response = await presentationService.createPresentation(presentationData);
        contentId = response.presentationId;
        contentTitle = inputType === 'topic' ? inputContent :
          inputType === 'youtube' ? 'YouTube Presentation' :
            selectedFile.name;

        toast.success('Presentation creation started! You\'ll be redirected when complete.');
      }

      // Start webhook polling
      const stopPolling = webhookService.startStatusPolling(
        contentId,
        outputType,
        (statusData) => {
          setGenerationStatus({
            status: statusData.status,
            message: statusData.message || 'Processing...',
            progress: statusData.progress
          });
        },
        async (completedData) => {
          setGenerationStatus({
            status: 'completed',
            message: 'Generation complete! Verifying content...',
            progress: 100
          });
          
          // Verify content is actually available before navigation
          try {
            // Add a small delay to ensure backend has fully processed
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Verify the content exists by making a quick check
            const verifyResponse = outputType === 'video' 
              ? await lessonService.getLesson(contentId)
              : await presentationService.getPresentation(contentId);
            
            if (verifyResponse) {
              const route = outputType === 'video' 
                ? `/lessons/${contentId}` 
                : `/presentations/${contentId}`;
              navigate(route);
            } else {
              throw new Error('Content not yet available');
            }
          } catch (error) {
            console.error('Content verification failed:', error);
            // If verification fails, try again after a longer delay
            setTimeout(() => {
              const route = outputType === 'video' 
                ? `/lessons/${contentId}` 
                : `/presentations/${contentId}`;
              navigate(route);
            }, 3000);
          }
        },
        (error) => {
          console.error('Generation failed:', error);
          toast.error(error.message || 'Generation failed');
          setIsGenerating(false);
          setGenerationStatus(null);
        }
      );

      // Store stop function for cleanup if needed
      return {
        contentId,
        contentTitle,
        stopPolling
      };

    } catch (error) {
      console.error('Error creating content:', error);
      toast.error(error.message || 'Failed to create content');
      setIsGenerating(false);
      setGenerationStatus(null);
    }
  }, [navigate]);

  const stopGeneration = useCallback(() => {
    setIsGenerating(false);
    setGenerationStatus(null);
  }, []);

  return {
    isGenerating,
    generationStatus,
    createContent,
    stopGeneration
  };
};

export default useContentGeneration;
