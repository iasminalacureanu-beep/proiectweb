require("dotenv").config(); 
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://proiectweb-frontend-kvqk.onrender.com' 
  ]
}));
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend-ul pentru filme funcționează perfect!" });
});

app.post("/api/movies/search", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Te rog să introduci numele unui film." });
  }

  try {
    const dbResponse = await fetch(`http://localhost:3000/movies?Title=${encodeURIComponent(title)}`);
    const dbMovies = await dbResponse.json();

    if (dbMovies.length > 0) {
      const cachedMovie = dbMovies; 
      const now = Date.now();
      
      const cacheAge = cachedMovie.timestamp ? now - cachedMovie.timestamp : Infinity; 
      
      const CACHE_EXPIRATION_TIME = 2 * 60 * 1000; 

      if (cacheAge < CACHE_EXPIRATION_TIME) {
        console.log(`Filmul "${title}" a fost încărcat din cache (este valid)!`);
        delete cachedMovie.timestamp; 
        return res.json(cachedMovie);
      } else {
        console.log(`Cache-ul pentru "${title}" a expirat. Se șterge și se actualizează...`);
        await fetch(`http://localhost:3000/movies/${cachedMovie.id}`, { method: "DELETE" });
      }
    }

    console.log(`Apelăm OMDb API pentru "${title}"...`);
    const apiKey = process.env.OMDB_API_KEY; 
    const omdbUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;
    
    const response = await fetch(omdbUrl);
    const data = await response.json();

    if (data.Response === "False") {
      return res.status(404).json({ error: "Filmul nu a fost găsit." });
    }

    const movieToSave = {
      id: data.imdbID,
      timestamp: Date.now(), 
      ...data          
    };

    await fetch("http://localhost:3000/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movieToSave),
    });
    console.log(`Filmul "${data.Title}" a fost salvat în baza de date cu o nouă ștampilă de timp!`);

    res.json(data);
  } catch (error) {
    console.error("Eroare la procesarea filmului:", error.message);
    res.status(500).json({ error: "Eroare internă la preluarea datelor despre film." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serverul rulează la http://localhost:${PORT}`);
});