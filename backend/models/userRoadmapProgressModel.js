const mongoose = require('mongoose');

const userRoadmapProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roadmapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap',
    required: true
  },
  completedSubtopics: [{
    subtopicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subtopic',
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastAccessed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

userRoadmapProgressSchema.index({ user: 1, roadmapId: 1 }, { unique: true });

module.exports = mongoose.model('UserRoadmapProgress', userRoadmapProgressSchema);
