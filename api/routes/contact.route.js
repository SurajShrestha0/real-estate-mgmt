import express from 'express';
import { sendMessage, fetchMessages, fetchUnreadMessages } from '../controller/contact.controller.js';

const router = express.Router();

// Define routes for handling message sending and fetching
router.post('/send', sendMessage);
router.get('/messages', fetchMessages);

// New route to fetch unread messages for the logged-in admin
router.get('/unread-messages', fetchUnreadMessages);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

export default router;
