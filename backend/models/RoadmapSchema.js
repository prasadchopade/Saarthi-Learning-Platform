const mongoose = require('mongoose');

const subtopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  duration: {
    type: String,
    required: false,
    default: '2-3 hours'
  },
  content: {
    type: String,
    required: false
  },
  contentGenerated: {
    type: Boolean,
    default: false
  },
  contentGeneratedAt: {
    type: Date
  },
  notes: {
    type: String,
    required: false
  },
  notesGenerated: {
    type: Boolean,
    default: false
  },
  notesGeneratedAt: {
    type: Date
  }
});

const topicSchema = new mongoose.Schema({
  sequence: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  subtopics: [subtopicSchema]
});

const roadmapSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  description: {
    type: String,
    required: false
  },
  learningType: {
    type: String,
    required: false,
    enum: ['goal-career', 'hobby', 'certification', 'project', 'learn-for-fun']
  },
  skillLevel: {
    type: String,
    required: false,
    enum: ['no-experience', 'beginner', 'intermediate', 'advanced', 'expert']
  },
  deadline: {
    type: Date,
    required: false
  },
  domain: {
    type: String,
    required: false
  },
  subdomain: {
    type: String,
    required: false
  },
  topics: [topicSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Roadmap', roadmapSchema);