import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaperPlane, 
  faRobot, 
  faClock, 
  faSpinner,
  faVideo,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import chatService from '../services/chatService';
import { toast } from 'react-hot-toast';

function Pragya({ currentVideoId, currentPresentationId }) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Initialize context when component mounts or video/presentation changes
  useEffect(() => {
    if (currentVideoId || currentPresentationId) {
      initializeContext();
    }
  }, [currentVideoId, currentPresentationId]);

  const initializeContext = async () => {
    try {
      setIsLoading(true);
      
      if (currentPresentationId) {
        await chatService.initializePresentationContext(currentPresentationId);
        const history = await chatService.getPresentationChatHistory(currentPresentationId);
        setChatHistory(history || []);
      }
      else if (currentVideoId) {
        // The server answers with a status rather than throwing, so a video
        // that simply has no captions reads as "no transcript" instead of the
        // generic failure it used to show.
        const result = await chatService.initializeContext(currentVideoId);
        if (result?.status && result.status !== 'exists') {
          setError(result.message || 'This video has no transcript, so questions about it cannot be answered.');
          return;
        }
        const history = await chatService.getChatHistory(currentVideoId);
        setChatHistory(history || []);
      }
    } catch (error) {
      console.error('Error initializing context:', error);
      setError(error.response?.data?.message || 'Failed to initialize chat. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (content) => {
    return (
      <div className="prose dark:prose-invert max-w-full overflow-auto">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  const handleSend = async () => {
    if (message.trim() === '' || isLoading) return;
    
    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);
    setError(null);

    // Add user message immediately
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      let response;
      
      // Send message to backend using appropriate chat service based on context
      if (currentPresentationId) {
        response = await chatService.sendPresentationMessage(currentPresentationId, userMessage);
        
        // Add AI response to chat
        setChatHistory(prev => [
          ...prev,
          { 
            role: 'assistant', 
            content: response.message,
            timestamp: new Date()
          }
        ]);
      } else if (currentVideoId) {
        response = await chatService.sendMessage(currentVideoId, userMessage);
        
        // Add AI response to chat with context
        setChatHistory(prev => [
          ...prev,
          { 
            role: 'assistant', 
            content: response.message,
            context: response.context,
            timestamp: new Date()
          }
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format timestamp for display
  const formatTimestamp = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <FontAwesomeIcon icon={faRobot} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentPresentationId ? "Ask questions about the presentation" : "Ask questions about the video"}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div 
        ref={chatContainerRef} 
        className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-800"
      >
        <AnimatePresence>
          {chatHistory.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-3 max-w-[85%] min-w-0 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}>
                <div className={`p-2 rounded-full flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                }`}>
                  <FontAwesomeIcon icon={message.role === 'user' ? faUser : faRobot} />
                </div>
                <div className={`rounded-2xl px-4 py-2 break-words w-full overflow-hidden ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}>
                  {message.role === 'user' ? (
                    <p>{message.content}</p>
                  ) : (
                    renderMessage(message.content)
                  )}
                  
                  {/* Video context segments */}
                  {message.role === 'assistant' && message.context && message.context.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        <FontAwesomeIcon icon={faVideo} className="mr-1" /> 
                        Relevant video segments:
                      </p>
                      <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                        {message.context.map((segment, idx) => (
                          <li key={idx} className="flex items-center">
                            <span className="inline-block w-8 text-right mr-1">
                              {formatTimestamp(segment.start)}
                            </span>
                            <span className="truncate">{segment.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-1 text-xs opacity-70">
                    <FontAwesomeIcon icon={faClock} className="mr-1" />
                    {message.timestamp 
                      ? new Date(message.timestamp).toLocaleTimeString() 
                      : new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                <FontAwesomeIcon icon={faRobot} />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-white dark:bg-gray-700">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 text-sm">
          <FontAwesomeIcon icon="exclamation-circle" className="mr-2" />
          {error}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={currentPresentationId ? "Ask a question about the presentation..." : "Ask a question about the video..."}
              className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 
                       text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isLoading}
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <FontAwesomeIcon icon={faSpinner} className="text-purple-500 animate-spin" />
              </div>
            )}
          </div>
          <button
            onClick={handleSend}
            disabled={isLoading || !message.trim()}
            className={`p-3 rounded-full transition-all duration-200 ${
              isLoading || !message.trim()
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pragya;