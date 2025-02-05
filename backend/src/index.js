import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.routes.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {app,server} from "./lib/socket.js"

dotenv.config();


const PORT = process.env.PORT || 5001; // Fallback to 5001 if PORT isn't set

// Middleware to parse JSON requests
app.use(express.json({ limit: "10mb" })); // Handle larger JSON payloads
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Handle larger URL-encoded payloads

// Cookie parser
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow cookies and credentials
  })
);

const userSocketMap={}; //{userId : socketId}
// Routes setup
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Catch undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err.message);
  res.status(500).json({ error: "An internal server error occurred" });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
