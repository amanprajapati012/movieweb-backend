import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, unique: true },
    imdbID: { type: String, default: null },
    title: String,
    overview: String,
    poster: String,
    backdrop: String,
    releaseDate: String,
    rating: Number,
    voteCount: Number,
    runtime: Number,
    budget: Number,
    tagline: String,
    genres: [String],
    industry: String,
    homepage: String,
    status: String,
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);
