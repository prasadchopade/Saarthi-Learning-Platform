import React from 'react';
import AutoSizeText from '../Utils/AutoSizeText';

const ColumnsSlide = ({ content }) => {
  const { title, columns = [] } = content;
  
  return (
    <div className="h-full p-6 flex flex-col">
      {title && (
        <div className="mb-4">
          <AutoSizeText 
            text={title}
            className="font-bold text-center"
            baseSize={24}
            minSize={18}
            maxSize={32}
            color="#000000"
          />
        </div>
      )}
      
      <div className="flex-1 flex">
        <div className={`w-full grid ${columns.length === 1 ? 'grid-cols-1' : columns.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-4`}>
          {columns.map((column, index) => (
            <div key={index} className="column p-1 flex flex-col items-center text-center h-full overflow-hidden">
 
              {column.heading && (
                <div className="mb-2">
                  <AutoSizeText 
                    text={column.heading}
                    className="font-semibold"
                    baseSize={16}
                    minSize={12}
                    maxSize={20}
                    color="#000000"
                  />
                </div>
              )}
              
              {column.text && (
                <div className="mb-2">
                  <AutoSizeText 
                    text={column.text}
                    className="font-normal"
                    baseSize={12}
                    minSize={8}
                    maxSize={16}
                    color="#333333"
                  />
                </div>
              )}
              
              {column.examples && column.examples.length > 0 && (
                <div className="mb-2">
                  <ul className="list-disc pl-4 text-left">
                    {column.examples.map((example, i) => (
                      <li key={i}>
                        <AutoSizeText 
                          text={example}
                          className="font-normal"
                          baseSize={10}
                          minSize={6}
                          maxSize={14}
                          color="#555555"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {column.explanation && (
                <div className=" pt-2 border-t border-gray-200">
                  <AutoSizeText 
                    text={column.explanation}
                    className="font-light italic"
                    baseSize={9}
                    minSize={6}
                    maxSize={12}
                    color="#666666"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default ColumnsSlide;
