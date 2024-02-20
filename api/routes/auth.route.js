import express from 'express';
import { google, signin, signup } from '../controller/auth.controller.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs'; // Corrected import statement

const router = express.Router();

router.post('/signup', signup);

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !bcryptjs.compareSync(password, user.password)) { // Changed to bcryptjs.compareSync
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, userType: user.userType }, process.env.JWT_SECRET);

    res.json({
      success: true,
      message: 'Login successful',
      userType: user.userType,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.post('/google', google);

export default router;
