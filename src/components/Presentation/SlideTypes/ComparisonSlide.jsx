import React from 'react';
import AutoSizeText from '../Utils/AutoSizeText';

const ComparisonSlide = ({ content }) => {
  const { title, items } = content;

  const renderComparisonItems = () => {
    if (!items || items.length === 0) {
      return <div className="text-gray-500">No comparison data available</div>;
    }
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
        {items.map((item, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full"
          >
            
            <div className="mb-4 pb-3 border-b border-gray-200">
              {item.title && (
                <h3 className="text-xl font-semibold text-gray-800">
                  {item.title}
                </h3>
              )}
            </div>
            
            
            <div className="flex-1">
              
              {item.points && (
                <ul className="space-y-2">
                  {item.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></div>
                      <AutoSizeText 
                        text={point}
                        className="font-normal"
                        baseSize={12}
                        minSize={8}
                        maxSize={16}
                        color="#333333"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
  };
  
  
  
  return (
    <div className="comparison-slide h-full p-6 flex flex-col">
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
      
      <div className="flex-1">
        {renderComparisonItems()}
      </div>
    </div>
  );
};

export default ComparisonSlide;
