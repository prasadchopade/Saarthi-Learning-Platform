const mongoose = require('mongoose');

const presentationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String
  },
  description: {
    type: String
  },
  theme: {
    type: String,
    default: 'default'
  },
  slides: [
    {
      type: {
        type: String,
        required: true,
        enum: ['title', 'bullets', 'columns', 'timeline', 'image', 'comparison']
      },
      content: {
        type: mongoose.Schema.Types.Mixed,
        required: true
      },
      transcript: {
        type: String
      },
      audioKey: {
        type: String
      }
    }
  ],
  inputType: {
    type: String,
    enum: ['topic', 'youtube', 'pdf'],
    required: true
  },
  inputContent: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    enum: ['exam_prep', 'deep_learning', 'quick_summary'],
    default: 'deep_learning'
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  error: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
presentationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Presentation', presentationSchema);
