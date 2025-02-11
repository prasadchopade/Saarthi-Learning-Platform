const express = require('express');
const { 
  addEmailToWaitlist,
  getWaitlistUsers,
  approveWaitlistUser,
  approveMultipleUsers,
  deleteWaitlistUser
} = require('../controllers/waitlistController');
const { waitlistLimiter } = require('../middleware/limitMiddleware');
const { adminMiddleware, authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route for adding to waitlist
router.post('/email', waitlistLimiter, addEmailToWaitlist);

// Admin-only. authMiddleware must run first: adminMiddleware reads req.user.email.
router.get('/users', authMiddleware, adminMiddleware, getWaitlistUsers);
router.put('/approve/:id', authMiddleware, adminMiddleware, approveWaitlistUser);
router.post('/approve-multiple', authMiddleware, adminMiddleware, approveMultipleUsers);
router.delete('/user/:id', authMiddleware, adminMiddleware, deleteWaitlistUser);

module.exports = router;
