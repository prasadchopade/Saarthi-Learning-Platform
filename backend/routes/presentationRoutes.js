const express = require('express');
const router = express.Router();
const presentationController = require('../controllers/presentationController');
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/presentations
 * @desc    Create a new presentation
 * @access  Private
 */
router.post('/', authMiddleware, presentationController.createPresentation);

/**
 * @route   GET /api/presentations
 * @desc    Get all presentations for the current user
 * @access  Private
 */
router.get('/', authMiddleware, presentationController.getPresentations);

/**
 * @route   GET /api/presentations/:id
 * @desc    Get a presentation by ID
 * @access  Private
 */
router.get('/:id', authMiddleware, presentationController.getPresentation);

/**
 * @route   GET /api/presentations/:id/status
 * @desc    Get presentation status for polling
 * @access  Private
 */
router.get('/:id/status', authMiddleware, presentationController.getPresentationStatus);

/**
 * @route   PUT /api/presentations/:id
 * @desc    Update a presentation
 * @access  Private
 */
router.put('/:id', authMiddleware, presentationController.updatePresentation);

/**
 * @route   DELETE /api/presentations/:id
 * @desc    Delete a presentation
 * @access  Private
 */
router.delete('/:id', authMiddleware, presentationController.deletePresentation);

module.exports = router;
