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
import http from "http";
import { Server } from "socket.io";

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

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Create HTTP server
const server = http.createServer(app);

// Integrate Socket.IO with the server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

// Listen for new connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for new form data
  socket.on("newFormData", ({ brokerId }) => {
    console.log("Received newFormData with brokerId:", brokerId);
    // Emit the newFormData event to the specific broker client
    socket.to(brokerId).emit("newFormData", { listingName: "Name of the listing" });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server
server.listen(3000, () => {
  console.log("Server is running on port 3000");
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

// Export io for use in other modules
export { io };
