const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmapController');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getRoadmaps, 
  getMyRoadmaps, 
  createRoadmap, 
  getRoadmapById, 
  deleteRoadmap, 
  getRoadmapProgress, 
  updateSubtopicProgress, 
  getRoadmapContent, 
  generateNotes, 
  generateGeneralRoadmap,
  generatePdfNotes
} = roadmapController;

router.get('/', authMiddleware, getRoadmaps);
router.get('/my-roadmaps', authMiddleware, getMyRoadmaps);
router.post('/', authMiddleware, createRoadmap);
router.post('/general', generateGeneralRoadmap); // No auth required for general roadmaps
router.get('/:id', authMiddleware, getRoadmapById);
router.delete('/:id', authMiddleware, deleteRoadmap);
router.get('/:roadmapId/progress', authMiddleware, getRoadmapProgress);
router.post('/:roadmapId/progress', authMiddleware, updateSubtopicProgress);
router.post('/:roadmapId/content', authMiddleware, getRoadmapContent);
router.post('/:roadmapId/generate-notes', authMiddleware, generateNotes);
router.post('/:roadmapId/generate-pdf-notes', authMiddleware, generatePdfNotes);

module.exports = router;