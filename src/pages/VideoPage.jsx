import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVideo } from "../hooks/useVideo";
import {
  VideoPlayer,
  WorkspaceTabs,
  WorkspaceContent,
  AIActions,
} from "../components/Video";
import LoadingSpinner from "../components/Common/LoadingSpinner";

const VideoPage = () => {
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState("notebook");
  const [selectedNotebookId, setSelectedNotebookId] = useState(null);
  const navigate = useNavigate();

  const { videoDetails, loading, isGeneratingNotes, generateSmartNotes } = useVideo();

  const [generatedNotes, setGeneratedNotes] = useState(null);

  const handleGenerateSmartNotes = async () => {
    setActiveWorkspaceTab('notebook');
    await generateSmartNotes(selectedNotebookId, (notes) => {
      setGeneratedNotes(notes);
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading video..." />;
  }

  return (
    <div className="flex flex-col bg-zinc-50 dark:bg-gray-900 font-inter h-screen">
      <div className="flex-1 flex min-h-0">
        {/* Left Section - Video and Content */}
        <div className="w-[55%] flex flex-col min-h-0 overflow-y-auto no-scrollbar">
          <VideoPlayer
            videoId={videoDetails?.videoId || videoDetails?.id}
            title={videoDetails?.title}
            onBack={() => navigate(-1)}
          />

          <div className="p-4 space-y-6">
            <AIActions
              isGeneratingNotes={isGeneratingNotes}
              onGenerateSmartNotes={handleGenerateSmartNotes}
              disabled={!selectedNotebookId }
            />

            {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {videoDetails?.description}
              </p>
            </div> */}

          </div>
        </div>


        {/* Right Section - Workspace */}
        <div className="w-[45%] flex flex-col h-screen border-l border-zinc-100 dark:border-gray-800">
          <WorkspaceTabs
            activeTab={activeWorkspaceTab}
            onTabChange={setActiveWorkspaceTab}
          />

          <WorkspaceContent
            activeTab={activeWorkspaceTab}
            selectedNotebookId={selectedNotebookId}
            setSelectedNotebookId={setSelectedNotebookId}
            videoId={videoDetails?.videoId || videoDetails?.id}
            generatedNotes={generatedNotes}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPage;