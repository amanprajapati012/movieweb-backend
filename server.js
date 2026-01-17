import dotenv from "dotenv";
dotenv.config(); // Must be first

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";

const app = express();

// ✅ CORS: Remove trailing slash if accidentally present
const allowedOrigin = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.replace(/\/$/, "")
  : "http://localhost:3000";

console.log("CORS allowed origin:", allowedOrigin);

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// ✅ JSON parser
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ✅ Connect to DB
connectDB();

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
