import axios from "axios";
import Movie from "../models/Movie.js";

export const fetchAndSaveMovies = async (req, res) => {
  try {
    console.log("📡 fetchAndSaveMovies called");

    let saved = 0;
    const totalPages = 13; // 13 * 20 ~ 260 movies

    for (let page = 1; page <= totalPages; page++) {
      console.log(`Fetching page ${page} from TMDB...`);

      const response = await axios.get("https://api.themoviedb.org/3/discover/movie", {
        params: { sort_by: "popularity.desc", page },
        headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
      });

      const movies = response.data.results;
      console.log(`Page ${page}: ${movies.length} movies fetched`);

      for (const m of movies) {
        // Skip if movie already exists
        const exists = await Movie.findOne({ tmdbId: m.id });
        if (exists) continue;

        // Fetch full details
        const detailRes = await axios.get(`https://api.themoviedb.org/3/movie/${m.id}`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
        });
        const d = detailRes.data;

        await Movie.create({
          tmdbId: d.id,
          imdbID: d.imdb_id || null,
          title: d.title,
          overview: d.overview,
          poster: d.poster_path ? `https://image.tmdb.org/t/p/w500${d.poster_path}` : "",
          backdrop: d.backdrop_path ? `https://image.tmdb.org/t/p/original${d.backdrop_path}` : "",
          releaseDate: d.release_date,
          rating: d.vote_average,
          voteCount: d.vote_count,
          runtime: d.runtime,
          budget: d.budget,
          tagline: d.tagline,
          genres: d.genres.map((g) => g.name),
          industry: "hollywood",
          homepage: d.homepage,
          status: d.status,
        });

        saved++;
        console.log(`✅ Saved movie: ${d.title}`);
      }
    }

    console.log(`🎬 Total movies saved: ${saved}`);
    res.json({ success: true, totalSaved: saved });
  } catch (error) {
    console.error("❌ TMDB ERROR:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
};



export const getMovies = async (req, res) => {
  try {
    console.log("📡 getMovies called with query:", req.query);

    const { page = 1, limit = 12, search = "", industry } = req.query;

    const query = { title: { $regex: search, $options: "i" } };
    if (industry) query.industry = industry;

    const movies = await Movie.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Movie.countDocuments(query);

    console.log(`Movies returned: ${movies.length} / Total: ${total}`);
    res.json({ success: true, movies, total, page: Number(page) });
  } catch (err) {
    console.error("❌ getMovies ERROR:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};


// controllers/movieController.js
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, movie });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


export const deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

