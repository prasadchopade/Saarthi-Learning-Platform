const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const DisciplineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  topics: [TopicSchema]
}, { timestamps: true });

const Discipline = mongoose.model('Discipline', DisciplineSchema);

module.exports = Discipline;