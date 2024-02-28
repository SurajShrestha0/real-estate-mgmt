import Listing from "../models/listing.model.js";
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
    
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, "You can only update your own account!"));
    }

    let updateFields = {};

    if (
      !req.body.username &&
      !req.body.email &&
      !req.body.password &&
      !req.body.avatar
    ) {
      return next(
        errorHandler(
          400,
          "At least one field (username, email, password, or avatar) is required for updating."
        )
      );
    }

    
    if (req.body.username) {
      updateFields.username = req.body.username;
    }

    
    if (req.body.email) {
      updateFields.email = req.body.email;
    }

    
    if (req.body.password) {
      updateFields.password = bcryptjs.hashSync(req.body.password, 10);
    }

    
    if (req.body.avatar) {
      updateFields.avatar = req.body.avatar;
    }

   
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    
    if (!updatedUser) {
      return next(errorHandler(404, "User not found."));
    }

    
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    
    if (req.user.id !== req.params.id && req.user.userType !== 'admin') {
      return next(errorHandler(401, "You can only delete your own account!"));
    }

   
    await User.findByIdAndDelete(req.params.id);

   
    res.clearCookie("access_token");

    
    res.status(200).json("User has been deleted!");
  } catch (error) {
    
    // next(error);
  }
};

const handleDeleteUser = async (userId) => {
  try {
    const message = await deleteUser(userId);
    if (message === "User has been deleted!") {
      // Remove the deleted user from the state
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userId)
      );
    } else {
      console.error("Error deleting user: ", message);
    }
  } catch (error) {
    console.error("Error deleting user: ", error);
  }
};


export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(
      errorHandler(
        401,
        "You can only view listings associated with your own account."
      )
    );
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User not found!!"));

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
  // const user = await User.findById(req.params.id);

  // if (!user) return next(errorHandler(404, "User not found!!"));

  // const { password: pass, ...rest } = user._doc;

  // res.status(200).json(rest);
};

export const getUsers = async (req, res, next) => {

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;
  
    const users = await User.find()
    .sort( { createdAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo},
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });


  } catch (error) {
    next(error);
  }
};

// export const getTotalUsers = async (req, res, next) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     res.status(200).json({ totalUsers });
//   } catch (error) {
//     next(errorHandler(500, "Internal server error"));
//   }
// };
