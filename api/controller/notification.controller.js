import notification from "../models/notifications.model.js";

export const createNotification = async (req, res) => {
  try {
    const { userId, title, type, text } = req.body;
    const newNotification = new notification({
      user: userId,
      title,
      type,
      text,
    });
    await newNotification.save();
    res
      .status(201)
      .json({
        message: "Notification created successfully",
        notification: newNotification,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating notification", error: error.message });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await notification.find({ user: userId });
    res.status(200).json({ notifications });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const updatedNotification = await notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    res
      .status(200)
      .json({
        message: "Notification marked as read",
        notification: updatedNotification,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error marking notification as read",
        error: error.message,
      });
  }
};
