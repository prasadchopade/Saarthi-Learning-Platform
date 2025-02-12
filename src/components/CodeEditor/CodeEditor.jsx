import React, { useState } from "react";
import { useCode } from "../../context/CodeContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-hot-toast';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle
} from 'react-resizable-panels';
import compilerService from "../../services/compilerService";
import {
  EditorHeader,
  EditorPanel,
  InputPanel,
  OutputPanel,
  AnalysisPanel,
  TabSelector,
  languageOptions
} from "./index";

const CodeEditor = () => {
  const { code, setCode, stdin, setStdin, output, setOutput } = useCode();
  const [language, setLanguage] = useState(languageOptions[3].id);
  const [loading, setLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('output');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [panelSize, setPanelSize] = useState(30);

  const handleTabClick = (tab) => {
    if (activeTab === tab && isPanelOpen) {
      setIsPanelOpen(false);
    } else {
      setActiveTab(tab);
      setIsPanelOpen(true);
    }
  };

  const executeCode = async () => {
    setIsPanelOpen(true);
    setActiveTab('output');
    setLoading(true);

    try {
      const response = await compilerService.executeCode({
        source_code: code,
        language_id: language,
        stdin
      });

      const { compilerToken } = response;

      setTimeout(async () => {
        try {
          const result = await compilerService.getExecutionResult(compilerToken);
          setOutput(result.stdout || result.stderr || "No output");
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Error getting execution result";
          toast.error(errorMessage);
          setOutput(errorMessage);
        } finally {
          setLoading(false);
        }
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error executing code";
      toast.error(errorMessage);
      setOutput(errorMessage);
      setLoading(false);
    }
  };

  const analyzeCode = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code to analyze");
      return;
    }

    setIsAnalyzing(true);
    setIsPanelOpen(true);
    setActiveTab('analysis');

    try {
      const languageName = languageOptions.find(lang => lang.id === language)?.name.toLowerCase();

      const response = await compilerService.analyzeCode({
        source_code: code,
        language: languageName,
        language_id: language
      });

      // If there's compilation error in the response
      if (response.error) {
        setAiAnalysis(`### Error Analysis 🔍
${response.error}

### Suggested Fix ✨
${response.suggestion || 'No specific fix suggested.'}

### Explanation 📝
${response.explanation || 'No additional explanation available.'}`);
      } else {
        // Format successful analysis
        setAiAnalysis(`
${response.analysis}

${response.suggestions ? `### Suggestions for Improvement ✨
${response.suggestions}` : ''}

${response.optimizations ? `### Possible Optimizations 🚀
${response.optimizations}` : ''}

${response.bestPractices ? `### Best Practices 📚
${response.bestPractices}` : ''}

${response.complexity ? `### Time & Space Complexity 📊
${response.complexity}` : ''}`);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error.response?.data?.message || "Failed to analyze code";
      toast.error(errorMessage);
      setAiAnalysis(`### Error ❌
Failed to analyze code. Please try again.

${error.response?.data?.message || error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Add resize handler
  const handlePanelResize = (sizes) => {
    setPanelSize(sizes[1]);
  };

  const clearCode = () => setCode("");

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <EditorHeader
        language={language}
        setLanguage={setLanguage}
        handleTabClick={handleTabClick}
        analyzeCode={analyzeCode}
        isAnalyzing={isAnalyzing}
        clearCode={clearCode}
        executeCode={executeCode}
        loading={loading}
      />

      {/* Editor and Bottom Panel */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="vertical" onLayout={handlePanelResize}>
          <Panel defaultSize={70} minSize={30}>
            <EditorPanel
              code={code}
              setCode={setCode}
              language={language}
              languageOptions={languageOptions}
            />
          </Panel>

          <PanelResizeHandle className="h-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-row-resize flex items-center justify-center group">
            <div className="w-8 h-1 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500" />
          </PanelResizeHandle>

          <Panel defaultSize={30} minSize={20}>
            <div className="h-full bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              {/* Tab Headers */}
              <TabSelector
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isAnalyzing={isAnalyzing}
                analyzeCode={analyzeCode}
                aiAnalysis={aiAnalysis}
              />

              {/* Tab Content */}
              <div className="p-4 h-[calc(100%-2.5rem)] overflow-auto">
                <AnimatePresence mode="wait">
                  {activeTab === 'input' ? (
                    <InputPanel stdin={stdin} setStdin={setStdin} />
                  ) : activeTab === 'output' ? (
                    <OutputPanel output={output} />
                  ) : (
                    <AnalysisPanel
                      isAnalyzing={isAnalyzing}
                      aiAnalysis={aiAnalysis}
                      analyzeCode={analyzeCode}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default CodeEditor;