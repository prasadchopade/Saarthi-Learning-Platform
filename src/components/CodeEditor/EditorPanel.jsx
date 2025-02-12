import React from "react";
import { Editor } from "@monaco-editor/react";

const EditorPanel = ({ code, setCode, language, languageOptions }) => {
  const languageName = languageOptions.find((lang) => lang.id === language)?.name.toLowerCase();

  return (
    <div className="h-full border border-gray-200 dark:border-gray-700">
      <Editor
        height="100%"
        theme="vs-dark"
        language={languageName}
        value={code}
        onChange={(value) => setCode(value)}
        options={{
          fontSize: 14,
          fontFamily: 'JetBrains Mono, monospace',
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          padding: { top: 20 },
          cursorBlinking: 'smooth',
        }}
      />
    </div>
  );
};

export default EditorPanel;
