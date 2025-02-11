const express = require('express');
const router = express.Router();
const {
    getNotebooks,
    createNotebook,
    deleteNotebook,
    saveNotebookContent,
    getNotebookContent
} = require('../controllers/notebookController');

const { enhanceNotes, generateSmartNotes } = require('../controllers/notesController');

const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/getNotebooks', authMiddleware, getNotebooks);
router.get('/getNotebookContent/:id', authMiddleware, getNotebookContent);

router.post('/createNotebook', authMiddleware, createNotebook);

router.delete('/deleteNotebook/:id', authMiddleware, deleteNotebook);

router.put('/saveNotebook/:id', authMiddleware, saveNotebookContent);

router.post('/enhanceNotes', authMiddleware, enhanceNotes);
router.post('/generateSmartNotes', authMiddleware, generateSmartNotes);

module.exports = router;
