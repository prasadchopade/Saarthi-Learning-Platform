import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faStar, 
  faSpinner,
  faBook,
  faPlus,
  faCheck,
  faTrash,
  faMicrochip,
  faCalculator,
  faFlask,
  faUsers,
  faBriefcase,
  faMedkit,
  faLeaf,
  faLayerGroup,
  faChalkboardTeacher
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { profileService } from '../../services/profileService';

const disciplineIcons = {
  "Computer Science & IT": faMicrochip,
  "Mathematics": faCalculator,
  "Natural Sciences": faFlask,
  "Social Sciences": faUsers,
  "Business & Economics": faBriefcase,
  "Health & Medicine": faMedkit,
  "Environmental & Earth Sciences": faLeaf,
  "Interdisciplinary & Emerging Fields": faLayerGroup,
  "Education & Pedagogy": faChalkboardTeacher,
  "Humanities & Arts": faBook
};

const InterestsSection = () => {
  const [disciplines, setDisciplines] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [disciplinesData, interestsData] = await Promise.all([
          profileService.getDisciplines(),
          profileService.getUserInterests()
        ]);
        
        setDisciplines(disciplinesData);
        setUserInterests(interestsData);
      } catch (err) {
        setError("Failed to load disciplines or interests");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addToInterests = async (discipline, topic) => {
    try {
      const updatedInterests = await profileService.addInterest(discipline, topic);
      setUserInterests(updatedInterests);
    } catch (err) {
      console.error("Failed to add interest", err);
    }
  };

  const removeFromInterests = async (discipline, topic) => {
    try {
      const updatedInterests = await profileService.removeInterest(discipline, topic);
      setUserInterests(updatedInterests);
    } catch (err) {
      console.error("Failed to remove interest", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FontAwesomeIcon icon={faSpinner} className="text-4xl text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Current Interests */}
      <div className="lg:col-span-4">
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6 sticky top-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
            Your Interests
          </h3>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {userInterests.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-50 dark:bg-zinc-700/50 p-6 rounded-lg">
                  <FontAwesomeIcon icon={faStar} className="text-gray-300 dark:text-gray-600 text-4xl mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No interests selected yet. Start by choosing topics that interest you.
                  </p>
                </div>
              </div>
            ) : (
              <AnimatePresence>
                {userInterests.map((interest) => (
                  <motion.div
                    key={`${interest.discipline}-${interest.topic}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-700/50 
                               rounded-lg group hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon 
                        icon={disciplineIcons[interest.discipline] || faBook} 
                        className="text-indigo-500 dark:text-indigo-400"
                      />
                      <span className="text-gray-900 dark:text-gray-100 font-medium">
                        {interest.topic}
                      </span>
                    </div>
                    <button
                      onClick={() => removeFromInterests(interest.discipline, interest.topic)}
                      className="text-gray-400 hover:text-red-500 dark:text-gray-500 
                                   dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove ${interest.topic}`}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Available Topics */}
      <div className="lg:col-span-8">
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Available Topics
          </h3>

          {/* Discipline Selection */}
          <div className="flex flex-wrap gap-2 mb-8">
            {disciplines.map((discipline) => (
              <button
                key={discipline.name}
                onClick={() => setSelectedDiscipline(discipline)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                            transition-colors ${selectedDiscipline?.name === discipline.name
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 ring-2 ring-indigo-500'
                            : 'bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600'}`}
              >
                <FontAwesomeIcon icon={disciplineIcons[discipline.name] || faBook} />
                <span>{discipline.name}</span>
              </button>
            ))}
          </div>

          {/* Topics Grid */}
          {selectedDiscipline && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {selectedDiscipline.topics.map((topic) => {
                const isSelected = userInterests.some(i => 
                  i.topic === topic.name && i.discipline === selectedDiscipline.name
                );
                
                return (
                  <motion.button
                    key={topic.name}
                    onClick={() => isSelected 
                      ? removeFromInterests(selectedDiscipline.name, topic.name)
                      : addToInterests(selectedDiscipline.name, topic.name)
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg text-left transition-all h-full
                                ${isSelected
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-500'
                                : 'bg-gray-50 dark:bg-zinc-700/50 hover:bg-gray-100 dark:hover:bg-zinc-700 border-2 border-transparent'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {topic.name}
                      </span>
                      <FontAwesomeIcon 
                        icon={isSelected ? faCheck : faPlus} 
                        className={isSelected 
                          ? "text-indigo-500" 
                          : "text-gray-400 dark:text-gray-500"} 
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          {!selectedDiscipline && (
            <div className="text-center py-20 bg-gray-50 dark:bg-zinc-700/30 rounded-lg">
              <FontAwesomeIcon icon={faBook} className="text-gray-300 dark:text-gray-600 text-4xl mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Select a discipline to view available topics
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterestsSection;
