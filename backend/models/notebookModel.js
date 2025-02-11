const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
});

const NotebookSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    images: [ImageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field on save
NotebookSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Notebook = mongoose.model('notebooks', NotebookSchema);
module.exports = Notebook;
