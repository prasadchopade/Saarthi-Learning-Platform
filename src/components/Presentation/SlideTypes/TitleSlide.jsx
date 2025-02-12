import React from 'react';
import AutoSizeText from '../Utils/AutoSizeText';

/**
 * TitleSlide component
 * Used for presentation title slides or section dividers
 */
const TitleSlide = ({ content }) => {
  const { title, subtitle } = content;
  
  return (
    <div 
      className="flex flex-col items-center justify-center h-full p-8 relative"
      
    >
      
      <div className="text-center relative" style={{ zIndex: 2 }}>
        {title && (
          <AutoSizeText 
            text={title}
            className="font-bold mb-4"
            baseSize={52}
            minSize={28}
            maxSize={64}
            color={'#000000'}
          />
        )}
        
        {subtitle && (
          <AutoSizeText 
            text={subtitle}
            className="font-medium"
            baseSize={28}
            minSize={18}
            maxSize={36}
            color={'#444444'}
          />
        )}
      </div>
    </div>
  );
};

export default TitleSlide;
