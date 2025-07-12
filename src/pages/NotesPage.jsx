import React, { useState } from 'react';
import Library from '../components/Library';
import Notebook from '../components/Notebook/Notebook';

/**
 * The notebooks, on their own page rather than only inside a video workspace.
 * Same two states the workspace uses: the list until you pick a notebook, the
 * editor once you have. The editor's own back control clears the selection and
 * returns you to the list.
 */
const NotesPage = () => {
  const [selectedNotebookId, setSelectedNotebookId] = useState(null);

  return (
    <div className="h-[calc(100vh-4rem)] overflow-auto bg-gray-50 dark:bg-zinc-900">
      {selectedNotebookId ? (
        <Notebook
          selectedNotebookId={selectedNotebookId}
          setSelectedNotebookId={setSelectedNotebookId}
        />
      ) : (
        <Library setSelectedNotebookId={setSelectedNotebookId} />
      )}
    </div>
  );
};

export default NotesPage;
