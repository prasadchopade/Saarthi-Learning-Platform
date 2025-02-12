import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import videoService from '../services/videoService';

export const useVideo = () => {
  const [videoDetails, setVideoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const { videoId } = useParams();
  const location = useLocation();

  const initializeVideoDetails = async () => {
    if (!videoId) return;
    
    try {
      setLoading(true);
      if (location.state?.videoDetails) {
        setVideoDetails({
          ...location.state.videoDetails,
          videoId: videoId
        });
      }
    } catch (error) {
      console.error('Error initializing video details:', error);
      toast.error('Failed to load video details');
    } finally {
      setLoading(false);
    }
  };

  const generateSmartNotes = async (selectedNotebookId, onNotesGenerated) => {
    if (!videoId) {
      toast.error('No video selected');
      return;
    }
    
    if (!selectedNotebookId) {
      toast.error('Please select a notebook first');
      return;
    }

    setIsGeneratingNotes(true);

    try {
      const response = await videoService.generateSmartNotes(
        videoId, 
        videoDetails?.title || 'Video Lecture',
      );
      
      if (response.success && response.notes) {
        if (onNotesGenerated) {
          onNotesGenerated(response.notes);
        }
        toast.success('Smart notes added at cursor position!');
      }
    } catch (error) {
      console.error('Error generating smart notes:', error);
      toast.error(error.response?.data?.message || 'Failed to generate smart notes');
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  useEffect(() => {
    initializeVideoDetails();
  }, [videoId]);

  return {
    videoDetails,
    loading,
    isGeneratingNotes,
    generateSmartNotes,
  };
};
