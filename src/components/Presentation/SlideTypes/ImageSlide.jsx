import React from 'react';
import AutoSizeText from '../Utils/AutoSizeText';

/**
 * ImageSlide component
 * Used for displaying images with optional title and caption
 */
const ImageSlide = ({ content }) => {
  const { title, image, caption, layout = 'center', background } = content;
  
  // Default background if none provided
  const slideBackground = background || '#ffffff';
  
  // Determine layout classes
  const getLayoutClasses = () => {
    switch (layout) {
      case 'full':
        return 'h-full w-full';
      case 'left':
        return 'flex flex-row';
      case 'right':
        return 'flex flex-row-reverse';
      case 'top':
        return 'flex flex-col';
      case 'bottom':
        return 'flex flex-col-reverse';
      case 'center':
      default:
        return 'flex flex-col items-center justify-center';
    }
  };
  
  // Calculate content and image sizes based on layout
  const isFullLayout = layout === 'full';
  const isHorizontalLayout = layout === 'left' || layout === 'right';
  const imageContainerClasses = isFullLayout 
    ? 'w-full h-full absolute inset-0' 
    : isHorizontalLayout 
      ? 'w-8/12 p-4' 
      : 'w-full flex-1 p-4';
  
  const textContainerClasses = isFullLayout 
    ? 'absolute bottom-0 left-0 right-0 p-6 bg-black bg-opacity-50 text-white' 
    : isHorizontalLayout 
      ? 'w-4/12 p-6 flex flex-col justify-center' 
      : 'w-full p-6';
  
  return (
    <div 
      className={`image-slide h-full ${getLayoutClasses()}`}
      style={{ background: slideBackground }}
    >
      {/* Image container */}
      <div className={imageContainerClasses}>
        {image && (
          <img 
            src={image} 
            alt={caption || title || "Slide image"} 
            className={`
              ${isFullLayout ? 'w-full h-full object-cover' : 'w-full h-full object-contain'}
              ${isFullLayout ? '' : 'rounded-lg shadow-lg'}
            `}
          />
        )}
      </div>
      
      {/* Text container */}
      <div className={textContainerClasses}>
        {title && (
          <AutoSizeText 
            text={title}
            className="font-bold mb-3"
            baseSize={32}
            minSize={20}
            maxSize={40}
            color={isFullLayout ? '#ffffff' : '#000000'}
          />
        )}
        
        {caption && (
          <AutoSizeText 
            text={caption}
            className="font-normal"
            baseSize={20}
            minSize={16}
            maxSize={24}
            color={isFullLayout ? '#eeeeee' : '#555555'}
          />
        )}
      </div>
    </div>
  );
};

export default ImageSlide;
