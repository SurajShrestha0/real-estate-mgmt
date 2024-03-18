import express from 'express';
import { createNotification, getUserNotifications, markAsRead } from '../controller/notification.controller.js';

const router = express.Router();

router.post('/create', createNotification);

router.get('/notifications', getUserNotifications);

router.put('/mark-as-read', markAsRead);

export default router; 