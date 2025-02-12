import React, { useState,useEffect } from 'react';
import notebookService from '../../services/notebookService';
import TiptapEditor from './Editor';

export default function Notebook({ selectedNotebookId, setSelectedNotebookId, currentVideoId, generatedNotes }) {
  const [content, setContent] = useState('');
  const [onNotesGenerated, setOnNotesGenerated] = useState(null);
  
  useEffect(() => {
    const fetchNotebookContent = async (selectedNotebookId) => {
      const content = await notebookService.getNotebookContent(selectedNotebookId);
      setContent(content);
    }
    fetchNotebookContent(selectedNotebookId);
  }, [selectedNotebookId]);
  
  // Handle generatedNotes prop changes
  useEffect(() => {
    if (generatedNotes) {
      setOnNotesGenerated(generatedNotes);
    }
  }, [generatedNotes]);

  return <TiptapEditor 
        initialContent={content}
        setSelectedNotebookId={setSelectedNotebookId}
        selectedNotebookId={selectedNotebookId}
        onNotesGenerated={onNotesGenerated}
        placeholder="Start writing here..."
      />
}