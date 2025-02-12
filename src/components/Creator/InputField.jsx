import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const InputField = ({ 
  inputType, 
  inputContent, 
  setInputContent, 
  selectedFile, 
  setSelectedFile,
  startPage,
  setStartPage,
  endPage,
  setEndPage
}) => {
  const fileInputRef = useRef(null);

  

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const renderInputField = () => {
    switch (inputType) {
      case 'topic':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What would you like to learn about?
            </label>
            <input
              type="text"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="e.g., Introduction to Machine Learning, Data Structures, Web Development"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-600 
                       bg-white dark:bg-zinc-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent
                       placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        );

      case 'youtube':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              YouTube Video URL
            </label>
            <input
              type="text"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="e.g., https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-600 
                       bg-white dark:bg-zinc-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent
                       placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        );

      case 'pdf':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload PDF Document
            </label>
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-zinc-600
                       bg-white dark:bg-zinc-800 text-gray-900 dark:text-white cursor-pointer
                       hover:bg-gray-50 dark:hover:bg-zinc-750 transition-colors
                       flex items-center justify-center"
            >
              {selectedFile ? (
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faFilePdf} />
                  <span>{selectedFile.name}</span>
                </div>
              ) : (
                <div className="text-center py-6">
                  <FontAwesomeIcon icon={faFilePdf} className="text-2xl mb-2 opacity-70" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click to select a PDF file or drag and drop here
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            {selectedFile && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Page Range
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Start Page</label>
                    <input
                      type="number"
                      min="1"
                      value={startPage}
                      onChange={(e) => setStartPage(Math.max(1, parseInt(e.target.value)))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 
                              bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">End Page</label>
                    <input
                      type="number"
                      min={startPage}
                      value={endPage}
                      onChange={(e) => setEndPage(Math.max(startPage, parseInt(e.target.value)))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 
                              bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return renderInputField();
};

export default InputField;