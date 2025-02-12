import React from 'react';
import AutoSizeText from '../Utils/AutoSizeText';

/**
 * BulletSlide component
 * Used for displaying bullet points with optional title
 */
const BulletSlide = ({ content }) => {
  const { title, bullets } = content;
  const containerClasses = 'h-full p-6 flex flex-col';
  
  return (
    <div className={containerClasses}>
      <div className="w-full flex flex-col p-4">
        {title && (
          <div className="mb-6">
            <AutoSizeText 
              text={title}
              className="font-bold"
              baseSize={20}
              minSize={10}
              maxSize={40}
              color="#000000"
            />
          </div>
        )}
        
        <div className="flex-1">
          <ul className="space-y-4">
            {bullets && bullets.map((bullet, index) => (
              <li key={index} className="flex items-start">
                <div className="h-2 w-2 rounded-full bg-blue-600 mt-3 mr-3 flex-shrink-0"></div>
                <div>
                  <AutoSizeText 
                    text={bullet}
                    className="font-normal"
                    baseSize={20}
                    minSize={16}
                    maxSize={24}
                    color="#333333"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BulletSlide;
