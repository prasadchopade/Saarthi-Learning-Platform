import React, { useState, useEffect, useRef } from 'react';

/**
 * AutoSizeText component
 * Automatically adjusts text size to fit its container
 */
const AutoSizeText = ({ 
  text, 
  className = '', 
  baseSize = 24, 
  minSize = 12, 
  maxSize = 48,
  color = '#000000',
  lineHeight = 1.2,
  maxLines = null
}) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(baseSize);
  
  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;
    
    // Function to calculate and set optimal font size
    const calculateFontSize = () => {
      // Start from a smaller size to avoid initial overflow
      const startSize = Math.min(baseSize, maxSize);
      textRef.current.style.fontSize = `${startSize}px`;
      
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = maxLines 
        ? containerRef.current.clientHeight
        : containerRef.current.parentElement?.clientHeight || Number.MAX_SAFE_INTEGER;
      
      // Binary search to find the optimal font size
      let minFontSize = minSize;
      let maxFontSize = startSize;
      let currentSize = startSize;
      let bestFittingSize = minSize;
      
      // First check if we need to reduce size at all
      if (
        textRef.current.scrollWidth <= containerWidth && 
        textRef.current.scrollHeight <= containerHeight
      ) {
        bestFittingSize = currentSize;
      } else {
        // Binary search to quickly find the best size
        while (minFontSize <= maxFontSize) {
          currentSize = Math.floor((minFontSize + maxFontSize) / 2);
          textRef.current.style.fontSize = `${currentSize}px`;
          
          if (
            textRef.current.scrollWidth <= containerWidth && 
            textRef.current.scrollHeight <= containerHeight
          ) {
            // This size fits, try a larger one
            bestFittingSize = currentSize;
            minFontSize = currentSize + 1;
          } else {
            // Too large, try a smaller size
            maxFontSize = currentSize - 1;
          }
        }
      }
      
      // Set the best fitting size
      textRef.current.style.fontSize = `${bestFittingSize}px`;
      setFontSize(bestFittingSize);
    };
    
    // Calculate on mount and when text or container changes
    calculateFontSize();
    
    // Set up resize observer to recalculate on container size changes
    const resizeObserver = new ResizeObserver(calculateFontSize);
    resizeObserver.observe(containerRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [text, baseSize, minSize, maxSize, maxLines]);
  
  return (
    <div 
      ref={containerRef} 
      className="auto-size-text-container w-full overflow-hidden"
    >
      <div
        ref={textRef}
        className={className}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight,
          color: color,
          whiteSpace: 'pre-wrap',
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default AutoSizeText;
