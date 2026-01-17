import express from "express";
import { fetchAndSaveMovies, getMovies, updateMovie, deleteMovie } from "../controllers/movieController.js";

const router = express.Router();

// Existing routes
router.get("/fetch", fetchAndSaveMovies);
router.get("/", getMovies);

// New routes
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);

export default router;
