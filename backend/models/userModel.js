const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
  discipline: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
});

const roadmapProgressSchema = new mongoose.Schema({
  roadmapId: {
    type: String,
    required: true
  },
  subtopicId: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String
  },
  geminiApiKey: {
    type: String
  },
  interests: [interestSchema],
  roadmapProgress: [roadmapProgressSchema],
  watchHistory: [{
    videoId: {
      type: String,
      required: true
    },
    title: {
      type: String
    },
    thumbnail: {
      type: String
    },
    channelTitle: {
      type: String
    },
    length: {
      type: String
    },
    watchedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

UserSchema.index({ email: 1 });

const UserModel = mongoose.model('social-logins', UserSchema);

module.exports = UserModel;