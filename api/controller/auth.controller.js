import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
  const { username, email, password, userType } = req.body;
  try {
    // Hashing the password asynchronously
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, userType });
    await newUser.save();

    const token = generateToken(newUser._id, newUser.userType);
    // Exclude password field from the response
    const { password: pass, ...rest } = newUser._doc;

    res.cookie('access_token', token, { httpOnly: true, path: '/api' });
    res.status(201).json({ success: true, message: "Signup successful", ...rest });
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
    const validUser = await User.findOne({ email });
    console.log("User found:", validUser); // Log user data

    if (!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = await bcryptjs.compare(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

    const token = generateToken(validUser._id, validUser.userType);
    console.log("Generated token:", token);

    // Store the token in a cookie with expiration time and SameSite attribute
    res.cookie('access_token', token, { 
      httpOnly: true, 
      expires: new Date(Date.now() + 3600000), // Token expires in 1 hour
      sameSite: 'strict' // Set SameSite attribute to prevent CSRF attacks
    });
    res.status(200).json({ success: true, message: "Login successful", token });

  } catch (error) {
    console.error("Error during sign-in:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const handleSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !bcryptjs.compareSync(password, user.password)) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET);

    res.json({
      success: true,
      message: 'Login successful',
      _id: user._id,
      username: user.username,
      email: user.email,
      userType: user.userType,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const google = async (req, res, next) => {
  try {
    const { email, name, photo } = req.body;

    // Check if the user already exists in the database
    let user = await User.findOne({ email });

    if (user) {
      // User exists, generate token and return user data
      const token = generateToken(user._id);
      const { password, ...userData } = user.toObject(); // Exclude password from user data
      res.cookie('access_token', token, { httpOnly: true }).status(200).json(userData);
    } else {
      // User doesn't exist, create a new user
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      
      // Generate a username based on the name
      const username = name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4);

      // Create the new user
      user = new User({
        username,
        email,
        password: hashedPassword,
        avatar: photo, // Assuming the photo contains the URL of the avatar
      });

      await user.save();

      // Generate token and return user data
      const token = generateToken(user._id);
      const { password, ...userData } = user.toObject(); // Exclude password from user data
      res.cookie('access_token', token, { httpOnly: true }).status(200).json(userData);
    }
  } catch (error) {
    next(error); // Pass any errors to the error handler middleware
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been signed out!');
  } catch (error) {
    next(error);
  }
};

// Function to generate JWT token with expiration time
const generateToken = (userId, userType) => {
  const expiresIn = '1h'; // Token expires in 1 hour
  return jwt.sign({ id: userId, userType }, process.env.JWT_SECRET, { expiresIn });
};
