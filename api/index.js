import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import contactRouter from "./routes/contact.route.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const app = express();

app.use(cors());

app.use(express.json());
app.use(cookieParser());

//Creating an HTTP server
const server = http.createServer(app);

//Intregrating Socket.Io
const io = new Server(server, {
    cors: {
       origin: "http://localhost:5173", 
       methods: ["GET", "POST"],
       allowedHeaders: ["my-custom-header"],
       credentials: true
    }
   });

io.on("connection", (socket) => {
  console.log("A user connected");

  //Listening for new messages
  socket.on("newMessage", (message) => {
    //Broadcasting the new message to all connected users
    io.emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/test", (req, res) => {
  res.send("Hello World");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/contact", contactRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

export { io };
