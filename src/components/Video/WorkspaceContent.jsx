import { motion, AnimatePresence } from "framer-motion";
import Pragya from "../Pragya";
import Notebook from "../Notebook/Notebook";
import CodeEditor from "../CodeEditor/CodeEditor";
import Library from "../Library";

const WorkspaceContent = ({ 
  activeTab, 
  selectedNotebookId, 
  setSelectedNotebookId, 
  videoId,
  PresentationId,
  generatedNotes
}) => {
  return (
    <div className="flex-1 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {activeTab === "notebook" && (
            <div className="h-full">
              {selectedNotebookId ? (
                <Notebook
                  setSelectedNotebookId={setSelectedNotebookId}
                  selectedNotebookId={selectedNotebookId}
                  currentVideoId={videoId}
                  currentPresentationId={PresentationId}
                  generatedNotes={generatedNotes}
                />
              ) : (
                <Library setSelectedNotebookId={setSelectedNotebookId} />
              )}
            </div>
          )}
          {activeTab === "code" && (
            <div className="h-full">
              <CodeEditor currentVideoId={videoId} currentPresentationId={PresentationId} />
            </div>
          )}
          {activeTab === "chat" && (
            <div className="h-full">
              <Pragya currentVideoId={videoId} currentPresentationId={PresentationId} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WorkspaceContent;
