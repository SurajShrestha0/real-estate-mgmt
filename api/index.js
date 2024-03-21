// Import necessary modules
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import contactRouter from "./routes/contact.route.js";
import tenantFormDataRouter from "./routes/brokerContactForm.route.js";
import notificationRouter from "./routes/notification.route.js";
import * as MagicBell from "magicbell";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Initialize MagicBell with API keys
const magicbell = new MagicBell({
  apiKey: "7a9b98ab0777134fc246eeab9aa82338718b0bff",
  apiSecret: "L8sAbmeLe3YKkVrb8HV448DIIEaDYr5Sznm7XjzS",
});

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Define routes
app.get("/test", (req, res) => {
  res.send("Hello World");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/contact", contactRouter);
app.use("/api/tenantFormData", tenantFormDataRouter);
app.use("/api/notification", notificationRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
