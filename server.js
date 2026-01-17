import dotenv from "dotenv";
dotenv.config(); // must be first!

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

// Test root route
app.get("/", (req, res) => {
  console.log("✅ Root route hit");
  res.send("Server is running");
});

// Connect DB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("TMDB TOKEN:", process.env.TMDB_ACCESS_TOKEN ? "LOADED" : "MISSING");
});
