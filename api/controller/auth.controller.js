// auth.controller.js

import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler }  from '../utils/error.js';

export const signup = async (req, res, next) => {
  const { username, email, password, userType } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    const newUser = new User({ username, email, password: hashedPassword, userType });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, userType: newUser.userType }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = newUser._doc;

    res.cookie('access_token', token, { httpOnly: true }).status(201).json(rest);
  } catch (error) {
    console.error("Error during signup:", error);

    let errorMessage = "Internal Server Error";

    if (error.message) {
      errorMessage = error.message;
    } else if (error.errors && Object.keys(error.errors).length > 0) {
      errorMessage = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
    }

    next(errorHandler(500, errorMessage));
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("Sign-in request:", email, password); // Log sign-in request
  try {
    const user = await User.findOne({ email });
    console.log("User found:", user); // Log user data
    if (!user || !bcryptjs.compareSync(password, user.password)) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, userType: user.userType }, process.env.JWT_SECRET);

    res.json({
      success: true,
      message: 'Login successful',
      userType: user.userType,
      userId: user._id, // Include user's ID in the response
      token,
    });

  } catch (error) {
    console.error("Error during sign-in:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      next(errorHandler(404, "User not found")); // Handle the case where user is not found
    }
  } catch (error) {
    console.error("Error during Google authentication:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};
