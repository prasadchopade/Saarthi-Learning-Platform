import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PresentationRenderer from '../components/Presentation/PresentationRenderer';
import LoadingSpinner from "../components/Common/LoadingSpinner";
import presentationService from "../services/presentationService";
import {
  WorkspaceTabs,
  WorkspaceContent,
} from "../components/Video";

const PresentationPage = () => {
  const [presentationData, setPresentationData] = useState(null);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState("notebook");
  const [loading, setLoading] = useState(true);
  const [selectedNotebookId, setSelectedNotebookId] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        const data = await presentationService.getPresentation(id);
        setPresentationData(data);
      } catch (error) {
        console.error("Failed to fetch presentation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPresentation();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading presentation..." />;
  }

  return (
    <div className="flex flex-col bg-zinc-50 dark:bg-gray-900 font-inter h-screen">
      <div className="flex-1 flex min-h-0">
        {/* Left Section - Presentation and Content */}
        <div className="w-[55%] flex flex-col min-h-0 overflow-y-auto no-scrollbar">
          <div className="bg-white dark:bg-gray-800 p-4 shadow-sm">
            <div className="flex items-center mb-4">
              <button 
                onClick={() => navigate(-1)}
                className="mr-4 text-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                ←
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {presentationData?.title || "Presentation"}
              </h1>
            </div>
            <div className="presentation-container">
              <PresentationRenderer presentation={presentationData} />
            </div>
          </div>

          <div className="p-4 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {presentationData?.description || "No description available."}
              </p>
            </div>
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
            PresentationId={presentationData?._id}
          />  
        </div>
      </div>
    </div>
  );
};

export default PresentationPage;
