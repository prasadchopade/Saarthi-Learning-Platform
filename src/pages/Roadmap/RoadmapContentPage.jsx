import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiYoutube, FiDownload, FiChevronDown, FiCheckCircle, FiCircle, FiLoader } from 'react-icons/fi';
import RoadmapGraph from '../../components/Roadmap/RoadmapGraph';
import MarkdownRenderer from '../../components/Common/MarkdownRenderer';
import toast from 'react-hot-toast';
import roadmapService from '../../services/roadmapService';
import { FaChalkboardTeacher } from 'react-icons/fa';

export default function RoadmapDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roadmapInfo, setRoadmapInfo] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [progress, setProgress] = useState({});
  const [showContent, setShowContent] = useState(false);
  const [content, setContent] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);

  // Fetch roadmap data and progress
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const roadmapResponse = await roadmapService.getRoadmapById(id);
        if (roadmapResponse) {
          setRoadmapInfo(roadmapResponse);
          try {
            const progressResponse = await roadmapService.getRoadmapProgress(roadmapResponse._id);
            if (progressResponse) {
              const progressMap = {};
              if (progressResponse.completedSubtopics) {
                progressResponse.completedSubtopics.forEach(item => {
                  progressMap[item.subtopicId] = true;
                });
              }
              setProgress(progressMap);
            }
          } catch (progressError) {
            console.error('Error fetching progress:', progressError);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
    setShowContent(false);
    setContent(null);
  };

  const handleSubtopicComplete = async (subtopicId, completed) => {
    try {
      if (!roadmapInfo || !selectedNode) {
        console.error('Missing roadmap info or selected node');
        return;
      }
      const topicSequence = selectedNode.data.parentSequence;
      
      if (!topicSequence) {
        console.error('Could not determine topic sequence for this subtopic');
        return;
      }
      
      const response = await roadmapService.updateSubtopicProgress(
        roadmapInfo._id,
        topicSequence,
        subtopicId,
        completed
      );
      if (response.success) {
        setProgress(prev => ({
          ...prev,
          [subtopicId]: completed
        }));
        toast.success(completed ? 'Topic marked as completed!' : 'Topic marked as incomplete');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const redirectToVideo = () => {
    if (selectedNode) {
      const searchQuery = `${roadmapInfo.name} ${selectedNode.data.label} tutorial`;
      window.open(`/search?query=${encodeURIComponent(searchQuery)}`, '_blank');
    }
  };

  const redirectToCreator = () => {
    if (selectedNode && roadmapInfo) {
      const params = new URLSearchParams({
        topic: selectedNode.data.label,
        outputType: 'presentation',
        learningMode: 'deep_learning',
        inputType: 'topic'
      });
      navigate(`/creator?${params.toString()}`);
    }
  };

  const generateAndDownloadNotes = async () => {
    if (!selectedNode) return;
    
    try {
      setNotesLoading(true);
      
      // Get the topic sequence from the selected node's parent
      const topicSequence = selectedNode.data.parentSequence;
      
      if (!topicSequence) {
        console.error('Could not determine topic sequence for this subtopic');
        setNotesLoading(false);
        return;
      }
      
      // Download PDF notes directly from backend using roadmapService
      const response = await roadmapService.downloadPdfNotes(
        roadmapInfo._id,
        topicSequence,
        selectedNode.data.id
      );
      
      if (response && response.success) {
        toast.success('Notes generated and downloaded successfully!');
      } else {
        // This might not be reached due to the way blob downloads work
        toast.success('Your download should begin shortly...');
      }
    } catch (error) {
      console.error('Error generating notes:', error);
      toast.error(error.message || 'Failed to generate PDF notes. Please try again later.');
    } finally {
      setNotesLoading(false);
    }
  };

  const generateContent = async () => {
    if (!selectedNode) return;
    
    try {
      setContentLoading(true);
      setShowContent(true);
      
      // Get the topic sequence from the selected node's parent
      const topicSequence = selectedNode.data.parentSequence;
      
      if (!topicSequence) {
        console.error('Could not determine topic sequence for this subtopic');
        setContentLoading(false);
        return;
      }
      
      const response = await roadmapService.getRoadmapContent(
        roadmapInfo._id,
        topicSequence,
        selectedNode.data.id
      );
      if (response.success) {
        setContent(response.content);
        toast.success('Content loaded successfully!');
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setContent(null);
      setShowContent(false);
    } finally {
      setContentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-2/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <header className="bg-white dark:bg-gray-800 shadow-sm flex-shrink-0 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400"
              >
                <FiArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {roadmapInfo?.title}
              </h1>
              <div className="w-20"></div> {/* Spacer for centering */}
            </div>
          </header>
          <div className="p-6">
            {selectedNode ? (
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedNode.data.label}
                  </h2>
                  
                  {selectedNode.data.type === 'subtopic' && (
                    <button
                      onClick={() => handleSubtopicComplete(
                        selectedNode.data.id,
                        !progress[selectedNode.data.id]
                      )}
                      className={`ml-3 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 flex items-center text-sm ${
                        progress[selectedNode.data.id]
                          ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {progress[selectedNode.data.id] ? (
                        <>
                          <FiCheckCircle className="mr-1.5" />
                          Completed
                        </>
                      ) : (
                        <>
                          <FiCircle className="mr-1.5" />
                          Mark Complete
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="flex items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="capitalize bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                    {selectedNode.data.type}
                  </span>
                  {selectedNode.data.duration && (
                    <span className="ml-3 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                      {selectedNode.data.duration}
                    </span>
                  )}
                </div>

                <div className="prose dark:prose-invert max-w-none mb-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedNode.data.description || 'No description available.'}
                  </p>
                </div>

                {selectedNode.data.type === 'subtopic' && (
                  <>
                    <div className="flex flex-wrap gap-3 mt-6 mb-6">
                      <button 
                        onClick={redirectToVideo}
                        className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg border border-red-100 hover:bg-red-100 transition-colors duration-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30 dark:hover:bg-red-900/30"
                      >
                        <FiYoutube className="mr-2" />
                        Youtube Videos
                      </button>

                      <button 
                        onClick={redirectToCreator}
                        className="flex items-center px-4 py-2 bg-purple-50 text-purple-600 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors duration-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30 dark:hover:bg-purple-900/30"
                      >
                        <FaChalkboardTeacher className="mr-2" />
                        Presentations
                      </button>
                      
                      <button 
                        onClick={generateAndDownloadNotes}
                        disabled={notesLoading}
                        className={`flex items-center px-4 py-2 rounded-lg border transition-colors duration-200 ${
                          notesLoading 
                            ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' 
                            : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30 dark:hover:bg-blue-900/30'
                        }`}
                      >
                        {notesLoading ? (
                          <>
                            <FiLoader className="mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <FiDownload className="mr-2" />
                            Download Notes
                          </>
                        )}
                      </button>
                    </div>
                    
                    <button
                      onClick={() => {
                        if (!showContent) {
                          generateContent();
                        } else {
                          setShowContent(false);
                        }
                      }}
                      className="w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors duration-200 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30 border border-purple-100 dark:border-purple-800/30"
                    >
                      {contentLoading ? (
                        <>
                          <FiLoader className="mr-2 animate-spin" />
                          Generating Content...
                        </>
                      ) : (
                        <>
                          {showContent ? 'Hide Content' : 'View Content'}
                          <FiChevronDown className={`ml-2 transition-transform duration-200 ${showContent ? 'transform rotate-180' : ''}`} />
                        </>
                      )}
                    </button>
                    
                    {showContent && (
                      <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/30">
                        
                        {contentLoading ? (
                          <div className="flex flex-col items-center justify-center py-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                            <p className="text-gray-500 dark:text-gray-400">Generating comprehensive content...</p>
                          </div>
                        ) : (
                          <MarkdownRenderer content={content} />
                        )}
                      </div>
                    )}
                  </>
                )}

                <div className="my-5 border-t border-gray-200 dark:border-gray-700"></div>

                {selectedNode.data.prerequisites && selectedNode.data.prerequisites.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Prerequisites</h3>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      {selectedNode.data.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Roadmap Overview
                </h2>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  This roadmap outlines the learning path for {roadmapInfo?.name}.
                  Click on any node in the graph to view more details.
                </p>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Roadmap Details:</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Learning Type:</span>
                      <span className="capitalize bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-md">
                        {roadmapInfo?.learningType?.replace('-', ' ') || 'General'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Skill Level:</span>
                      <span className="capitalize bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md">
                        {roadmapInfo?.skillLevel?.replace('-', ' ') || 'General'}
                      </span>
                    </div>
                    {roadmapInfo?.deadline && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Deadline:</span>
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-md">
                          {new Date(roadmapInfo.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total Topics:</span>
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md">
                        {roadmapInfo?.topics?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mt-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">How to use:</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Topics are main learning areas
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Subtopics are specific skills to learn
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Mark topics as complete to track progress
                    </li>
                  </ul>
                </div>

                {Object.keys(progress).length > 0 && (
                  <div className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">Your Progress</h3>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{
                          width: `${Object.keys(progress).length ?
                            Math.round(Object.values(progress).filter(Boolean).length / Object.keys(progress).length * 100) : 0}%`
                        }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {Object.values(progress).filter(Boolean).length} of {Object.keys(progress).length} completed
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Graph */}
        <div className="w-2/4 relative">
          <RoadmapGraph
            roadmap={roadmapInfo}
            onNodeSelect={handleNodeSelect}
            progress={progress}
            onSubtopicComplete={handleSubtopicComplete}
          />
        </div>
      </div>
    </div>
  );
}