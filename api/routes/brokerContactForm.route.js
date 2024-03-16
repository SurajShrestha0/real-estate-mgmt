import express from 'express';
import { saveTenantFormData, getTenantFormData } from '../controller/brokerContactForm.controller.js';

const router = express.Router();

// POST endpoint to save form data
router.post('/saveFormData', saveTenantFormData);

// GET endpoint to fetch form data
router.get('/getFormData/:brokerId', getTenantFormData);

export default router;
