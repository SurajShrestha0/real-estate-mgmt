import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({
    message: "API route is working..",
  });
};

export const updateUser = async (req, res, next) => {
  try {
    // Check if req.user.id matches req.params.id
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, "You can only update your own account!"));
    }

    let updateFields = {};

    // Check if at least one field is provided for updating
    if (!req.body.username && !req.body.email && !req.body.password && !req.body.avatar) {
      return next(errorHandler(400, "At least one field (username, email, password, or avatar) is required for updating."));
    }

    // Check if username is provided and update it
    if (req.body.username) {
      updateFields.username = req.body.username;
    }

    // Check if email is provided and update it
    if (req.body.email) {
      updateFields.email = req.body.email;
    }

    // Check if password is provided and hash it
    if (req.body.password) {
      updateFields.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // Check if avatar is provided and update it
    if (req.body.avatar) {
      updateFields.avatar = req.body.avatar;
    }

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    // If no user found with the provided ID, respond with a 404 error
    if (!updatedUser) {
      return next(errorHandler(404, "User not found."));
    }

    // Omit sensitive information from response
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if(req.user.id != req.params.id) return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
}
