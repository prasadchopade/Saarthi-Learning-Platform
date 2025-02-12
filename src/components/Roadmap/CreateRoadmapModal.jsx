import { useState } from 'react';
import { FiX, FiCalendar, FiTarget, FiUser, FiBookOpen } from 'react-icons/fi';

const CreateRoadmapModal = ({ isOpen, onClose, onSubmit, submitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    dailyHours: '',
    learningType: '',
    goalCareer: '',
    hobby: '',
    certification: '',
    project: '',
    learnForFun: '',
    deadline: '',
    skillLevel: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const learningTypes = [
    { value: 'goal-career', label: 'Goal/Career', icon: FiTarget },
    { value: 'hobby', label: 'Hobby', icon: FiBookOpen },
    { value: 'certification', label: 'Certification', icon: FiUser },
    { value: 'project', label: 'Project', icon: FiTarget },
    { value: 'learn-for-fun', label: 'Learn for Fun', icon: FiBookOpen }
  ];

  const skillLevels = [
    { value: 'no-experience', label: 'No experience', icon: FiUser },
    { value: 'beginner', label: 'Beginner', icon: FiUser },
    { value: 'intermediate', label: 'Intermediate', icon: FiUser },
    { value: 'advanced', label: 'Advanced', icon: FiUser },
    { value: 'expert', label: 'Expert', icon: FiUser }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.learningType) {
      newErrors.learningType = 'Please select what you want to learn';
    }

    if (!formData.skillLevel) {
      newErrors.skillLevel = 'Please select your current skill level';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.deadline = 'Deadline cannot be in the past';
      }
    }

    if (!formData.dailyHours) {
      newErrors.dailyHours = 'Please select how many hours per day you can dedicate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const roadmapData = {
      title: formData.title,
      learningType: formData.learningType,
      skillLevel: formData.skillLevel,
      deadline: formData.deadline,
      dailyHours: formData.dailyHours,
      description: formData.description,
      // Include specific fields based on learning type
      ...(formData.learningType === 'goal-career' && { goalCareer: formData.goalCareer }),
      ...(formData.learningType === 'hobby' && { hobby: formData.hobby }),
      ...(formData.learningType === 'certification' && { certification: formData.certification }),
      ...(formData.learningType === 'project' && { project: formData.project }),
      ...(formData.learningType === 'learn-for-fun' && { learnForFun: formData.learnForFun })
    };

    onSubmit(roadmapData);
  };

  const handleClose = () => {
    setFormData({
      title: '',
      learningType: '',
      goalCareer: '',
      hobby: '',
      certification: '',
      project: '',
      learnForFun: '',
      deadline: '',
      skillLevel: '',
      dailyHours: '',
      description: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create Your Roadmap
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What do you want to learn? *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., React.js, Machine Learning, Digital Marketing"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Learning Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                What's your purpose for learning? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {learningTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange('learningType', type.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all
                        ${formData.learningType === type.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {type.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.learningType && (
                <p className="mt-1 text-sm text-red-600">{errors.learningType}</p>
              )}
            </div>

            {/* Specific Learning Type Input */}
            {formData.learningType && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {formData.learningType === 'goal-career' && 'Career Goal'}
                  {formData.learningType === 'hobby' && 'Hobby Details'}
                  {formData.learningType === 'certification' && 'Certification Name'}
                  {formData.learningType === 'project' && 'Project Description'}
                  {formData.learningType === 'learn-for-fun' && 'What interests you?'}
                </label>
                <textarea
                  value={formData[formData.learningType] || ''}
                  onChange={(e) => handleInputChange(formData.learningType, e.target.value)}
                  placeholder={`Tell us more about your ${formData.learningType.replace('-', ' ')}...`}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            )}

            {/* Skill Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current skill level in this domain *
              </label>
              <select
                value={formData.skillLevel}
                onChange={(e) => handleInputChange('skillLevel', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  ${errors.skillLevel ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              >
                <option value="">Select your skill level</option>
                {skillLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {errors.skillLevel && (
                <p className="mt-1 text-sm text-red-600">{errors.skillLevel}</p>
              )}
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiCalendar className="inline w-4 h-4 mr-1" />
                Deadline or target date *
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  ${errors.deadline ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              {errors.deadline && (
                <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
              )}
            </div>

            {/* Daily Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                How many hours per day can you dedicate? *
              </label>
              <select
                value={formData.dailyHours}
                onChange={(e) => handleInputChange('dailyHours', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  ${errors.dailyHours ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              >
                <option value="">Select daily hours</option>
                <option value="0.5">30 minutes</option>
                <option value="1">1 hour</option>
                <option value="1.5">1.5 hours</option>
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
                <option value="4">4 hours</option>
                <option value="5">5 hours</option>
                <option value="6">6 hours</option>
                <option value="8">8 hours</option>
                <option value="10">10+ hours</option>
              </select>
              {errors.dailyHours && (
                <p className="mt-1 text-sm text-red-600">{errors.dailyHours}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional notes (optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Any specific requirements, preferences, or additional context..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                  focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                  text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                  transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg
                  hover:bg-purple-700 transition-colors font-medium"
              >
                {submitting ? 'Creating...' : 'Create Roadmap'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoadmapModal;
