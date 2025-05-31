import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';
import LoadingGame from '../components/Creator/LoadingGame';
import InputTypeSelector from '../components/Creator/InputTypeSelector';
import OutputTypeSelector from '../components/Creator/OutputTypeSelector';
import ModeSelector from '../components/Creator/ModeSelector';
import InputField from '../components/Creator/InputField';
import ContentList from '../components/Creator/ContentList';
import lessonService from '../services/lessonService';
import presentationService from '../services/presentationService';
import useContentGeneration from '../hooks/useContentGeneration';
import { useSearchParams } from 'react-router-dom';


const LessonCreator = () => {
  const [searchParams] = useSearchParams();
  const [inputType, setInputType] = useState('topic');
  const [inputContent, setInputContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(5);
  const [learningMode, setLearningMode] = useState('deep_learning');
  // 'video' is disabled in OutputTypeSelector and has no backend route, so it
  // must not be the default - the Create button would post to /api/lessons/create.
  const [outputType, setOutputType] = useState('presentation');
  const [recentLessons, setRecentLessons] = useState([]);
  const [recentPresentations, setRecentPresentations] = useState([]);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [activeTab, setActiveTab] = useState('presentations');

  const { isGenerating, generationStatus, createContent } = useContentGeneration();
  
  const navigate = (route) => {
    window.location.href = route;
  };

  // Handle URL parameters for pre-filling form values
  useEffect(() => {
    const topic = searchParams.get('topic');
    const outputTypeParam = searchParams.get('outputType');
    const learningModeParam = searchParams.get('learningMode');
    const inputTypeParam = searchParams.get('inputType');

    if (topic) {
      setInputContent(topic);
    }
    
    if (topic) {
      setInputContent(`${topic}`);
    }

    if (outputTypeParam && ['video', 'presentation'].includes(outputTypeParam)) {
      setOutputType(outputTypeParam);
      setActiveTab(outputTypeParam === 'video' ? 'lessons' : 'presentations');
    }

    if (learningModeParam && ['deep_learning', 'quick_learning'].includes(learningModeParam)) {
      setLearningMode(learningModeParam);
    }

    if (inputTypeParam && ['topic', 'text', 'file'].includes(inputTypeParam)) {
      setInputType(inputTypeParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [presentations] = await Promise.all([
          // lessonService.getLessons(),
          presentationService.getPresentations()
        ]);

        setRecentPresentations(presentations);
        setIsLoadingContent(false);
      } catch (error) {
        console.error('Failed to fetch content:', error);
        setIsLoadingContent(false);
      }
    };

    fetchContent();
  }, []);

  const handleCreateContent = async () => {
    const inputData = {
      inputType,
      inputContent,
      selectedFile,
      startPage,
      endPage,
    };

    const result = await createContent(inputData, outputType, learningMode);
    
    if (result) {
      // Add pending content to the appropriate list
      const pendingContent = {
        id: result.contentId,
        title: result.contentTitle,
          status: 'processing',
          createdAt: new Date().toISOString(),
          mode: learningMode
        };

      if (outputType === 'video') {
        setRecentLessons(prev => [pendingContent, ...prev]);
      } else {
        setRecentPresentations(prev => [pendingContent, ...prev]);
      }
    }
  };

  const handlePresentationDeleted = (presentationId) => {
    setRecentPresentations(prev => 
      prev.filter(presentation => presentation._id !== presentationId)
    );
  };


  return (
    <>
      {isGenerating && (
        <LoadingGame 
          status={generationStatus?.status}
          message={generationStatus?.message}
          progress={generationStatus?.progress}
        />
      )}
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 px-6 py-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Create Your Own Learning Content
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Turn any content into interactive videos or presentations with AI
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-16">
            <div className="bg-white dark:bg-zinc-800/90 rounded-2xl shadow-md border border-gray-100 dark:border-zinc-700 overflow-hidden">
              <div className="p-8">
                <div className="space-y-2">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Select Input Type
                    </label>
                    <InputTypeSelector selectedType={inputType} onSelect={setInputType} />
                  </div>

                  {/* Input Field based on selected type */}
                  <InputField
                    inputType={inputType}
                    inputContent={inputContent}
                    setInputContent={setInputContent}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    startPage={startPage}
                    setStartPage={setStartPage}
                    endPage={endPage}
                    setEndPage={setEndPage}
                  />


                  <div className="mt-8">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Select Learning Mode
                    </label>
                    <ModeSelector selectedMode={learningMode} onSelect={setLearningMode} />
                  </div>
                </div>

                {/* Output Type Selection */}
                <div className="mt-8">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select Output Type
                  </label>
                  <OutputTypeSelector selectedType={outputType} onSelect={setOutputType} />
                </div>
                {/* Generate Button */}
                <motion.button
                  onClick={handleCreateContent}
                  disabled={isGenerating}
                  className="w-full mt-8 flex items-center justify-center gap-2 px-6 py-4 rounded-xl
                           bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
                           text-white font-medium transition-all duration-200 disabled:opacity-50
                           shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isGenerating ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                      <span>Creating {outputType === 'video' ? 'Learning Deck' : 'Presentation'}...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faWandMagicSparkles} />
                      <span>Create {outputType === 'video' ? 'Learning Deck' : 'Presentation'}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Recent Content Section */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recent Content
              </h2>
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'lessons'
                      ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  onClick={() => setActiveTab('lessons')}
                >
                  Video Lessons
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'presentations'
                      ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  onClick={() => setActiveTab('presentations')}
                >
                  Presentations
                </button>
              </div>
            </div>

            <ContentList
              activeTab={activeTab}
              isLoadingContent={isLoadingContent}
              recentLessons={recentLessons}
              recentPresentations={recentPresentations}
              onNavigate={navigate}
              onPresentationDeleted={handlePresentationDeleted}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonCreator;