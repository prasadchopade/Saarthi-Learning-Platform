import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVideo,
  faGraduationCap,
    faSpinner,
    faPersonChalkboard,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import LessonCardSkeleton from './LessonCardSkeleton';
import DeleteConfirmationModal from '../Common/DeleteConfirmationModal';
import presentationService from '../../services/presentationService';

const ContentList = ({ 
  activeTab, 
  isLoadingContent, 
  recentLessons, 
  recentPresentations, 
  onNavigate,
  onPresentationDeleted
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleDeletePresentation = async (presentationId) => {
    try {
      setDeletingId(presentationId);
      await presentationService.deletePresentation(presentationId);
      if (onPresentationDeleted) {
        onPresentationDeleted(presentationId);
      }
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting presentation:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const renderContentList = () => {
    if (activeTab === 'lessons') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingContent ? (
            // Skeleton loading
            [...Array(6)].map((_, i) => (
              <LessonCardSkeleton key={i} />
            ))
          ) : (
            // Recent lessons
            recentLessons && recentLessons.length > 0 ? (
              recentLessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm
                           hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => onNavigate(`/lessons/${lesson.id}`)}
                >
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative">
                    {lesson.thumbnail ? (
                      <img
                        src={lesson.thumbnail}
                        alt={lesson.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faGraduationCap} className="text-4xl text-gray-400 dark:text-gray-600" />
                      </div>
                    )}

                    {lesson.mode && (
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                        {lesson.mode === 'exam_prep' ? 'Exam Prep' :
                          lesson.mode === 'deep_learning' ? 'Deep Learning' : 'Quick Summary'}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Created {new Date(lesson.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-16 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-xl">
                <FontAwesomeIcon icon={faVideo} className="text-4xl text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  No video lessons created yet. Try creating your first interactive video!
                </p>
              </div>
            )
          )}
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingContent ? (
            // Skeleton loading
            [...Array(6)].map((_, i) => (
              <LessonCardSkeleton key={i} />
            ))
          ) : (
            // Recent presentations
            recentPresentations && recentPresentations.length > 0 ? (
              recentPresentations.map((presentation) => (
                <motion.div
                  key={presentation._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm
                           hover:shadow-md transition-all duration-200 group relative"
                >
                  <div
                    className="aspect-video min-h-[200px] bg-gray-200 dark:bg-gray-800 relative cursor-pointer rounded-xl border border-gray-400 dark:border-gray-700"
                    onClick={() => onNavigate(`/presentations/${presentation._id}`)}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div className="">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1 text-center">
                      {presentation.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-200 text-center">
                      Created - {new Date(presentation.createdAt).toLocaleDateString()}
                    </p>
                    </div>
                      </div>

                    {presentation.mode && (
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                        {presentation.mode === 'exam_prep' ? 'Exam Prep' :
                          presentation.mode === 'deep_learning' ? 'Deep Learning' : 'Quick Summary'}
                      </div>
                    )}

                    {presentation.status === 'processing' && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                        <span>Processing</span>
                      </div>
                    )}

                    <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(presentation._id);
                        }}
                        className="absolute top-2 right-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        title="Delete presentation"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-sm dark:text-white text-black" />
                      </button>
                    
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-16 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-xl">
                <FontAwesomeIcon icon={faPersonChalkboard} className="text-4xl text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  No presentations created yet. Try creating your first interactive presentation!
                </p>
              </div>
            )
          )}
        </div>
      );
    }
  };

  // Get the presentation being deleted for display in modal
  const presentationToDelete = showDeleteConfirm 
    ? recentPresentations?.find(p => p._id === showDeleteConfirm)
    : null;

  return (
    <>
      {renderContentList()}
      
      <DeleteConfirmationModal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => handleDeletePresentation(showDeleteConfirm)}
        title="Delete Presentation"
        itemName={presentationToDelete?.title}
        isDeleting={deletingId === showDeleteConfirm}
      />
    </>
  );
};

export default ContentList;
