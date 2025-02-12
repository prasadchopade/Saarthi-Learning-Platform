import TitleSlide from './SlideTypes/TitleSlide';
import BulletSlide from './SlideTypes/BulletSlide';
import TimelineSlide from './SlideTypes/TimelineSlide';
import ImageSlide from './SlideTypes/ImageSlide';
import ComparisonSlide from './SlideTypes/ComparisonSlide';
import ColumnsSlide from './SlideTypes/ColumnsSlide';

/**
 * SlideRenderer component
 * Renders the appropriate slide component based on slide type
 */
const SlideRenderer = ({ slide, slideIndex }) => {
  const slideStyle = {
    width: '100%',
    maxWidth: '800px',
    height: '100%',
    maxHeight: '450px',
    position: 'relative',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    aspectRatio: '16/9',
  };

  // Render the appropriate slide component based on type
  const renderSlideContent = () => {
    switch (slide.type) {
      case 'title':
        return <TitleSlide content={slide.content} />;
      case 'bullets':
        return <BulletSlide content={slide.content} />;
      case 'timeline':
        return <TimelineSlide content={slide.content} />;
      case 'image':
        return <ImageSlide content={slide.content} />;
      case 'comparison':
        return <ComparisonSlide content={slide.content} />;
      case 'columns':
        return <ColumnsSlide content={slide.content} />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Unknown slide type: {slide.type}</p>
          </div>
        );
    }
  };

  return (
    <div style={slideStyle} className="slide-container flex items-center justify-center">
      {/* Render slide content */}
      {renderSlideContent()}
    </div>
  );
};

export default SlideRenderer;
