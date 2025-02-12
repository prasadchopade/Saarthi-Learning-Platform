import React from 'react';
import AutoSizeText from '../Utils/AutoSizeText';

/**
 * TimelineSlide component
 * Used for displaying sequential events or processes
 */
const TimelineSlide = ({ content }) => {
  const { title, events, layout = 'horizontal' } = content;
  
  // Determine if we're using horizontal or vertical layout
  const isHorizontal = layout === 'horizontal';
  
  return (
    <div className="timeline-slide h-full p-6 flex flex-col">
      {/* Title section */}
      {title && (
        <div className="mb-6">
          <AutoSizeText 
            text={title}
            className="font-bold"
            baseSize={32}
            minSize={22}
            maxSize={40}
            color="#000000"
          />
        </div>
      )}
      
      {/* Timeline content */}
      <div className="flex-1 flex items-center">
        <div className={`w-full ${isHorizontal ? 'flex items-center justify-between' : 'space-y-6'}`}>
          {events && events.map((event, index) => (
            <div 
              key={index} 
              className={`
                relative 
                ${isHorizontal ? 'flex-1' : 'flex'} 
                ${isHorizontal && index % 2 === 0 ? 'flex-col' : isHorizontal ? 'flex-col-reverse' : 'items-start'}
              `}
            >
              {/* Timeline connector */}
              {isHorizontal && index < events.length - 1 && (
                <div className="absolute top-1/2 right-0 w-full h-1 bg-blue-200 z-0" />
              )}
              
              {!isHorizontal && index < events.length - 1 && (
                <div className="absolute top-8 left-4 w-1 h-full bg-blue-200 z-0" />
              )}
              
              {/* Event content */}
              <div className={`
                relative z-10 
                ${isHorizontal ? 'mx-auto mb-4 mt-4' : 'ml-12'}
              `}>
                <div className="bg-white rounded-lg shadow-md p-4 max-w-xs">
                  {event.date && (
                    <div className="text-sm font-semibold text-blue-600 mb-1">
                      {event.date}
                    </div>
                  )}
                  
                  {event.title && (
                    <div className="font-medium text-gray-900 mb-1">
                      {event.title}
                    </div>
                  )}
                  
                  {event.description && (
                    <div className="text-sm text-gray-600">
                      {event.description}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Timeline node */}
              <div className={`
                w-8 h-8 rounded-full bg-blue-500 z-10 flex items-center justify-center text-white font-bold
                ${isHorizontal ? 'mx-auto' : 'absolute left-0 top-4'}
              `}>
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineSlide;
