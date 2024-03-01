import express from 'express';
import { sendMessage, fetchMessages } from '../controller/contact.controller.js';

const router = express.Router();

// Define route for handling message sending
router.post('/send', sendMessage);
router.get('/messages', fetchMessages);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

export default router;
