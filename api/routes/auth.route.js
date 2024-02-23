import express from 'express';
import { google, signout, signup } from '../controller/auth.controller.js';
import { handleSignIn } from '../controller/auth.controller.js'; // Import handleSignIn from the controller

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', handleSignIn); // Use handleSignIn for signing in
router.post('/google', google);
router.get('/signout', signout);

export default router;
