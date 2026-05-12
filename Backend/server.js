require("dotenv").config(); 
const express = require("express");
const cors = require('cors');

const app = express(); 

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://proiectweb-mu.vercel.app', 
    'https://proiectweb-frontend-kvqk.onrender.com'
  ]
}));

app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend-ul funcționează!" });
});

app.post("/api/movies/search", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Te rog să introduci numele unui film." });
  }

  try {
    console.log(`Apelăm OMDb API pentru "${title}"...`);
    const apiKey = process.env.OMDB_API_KEY; 
    const omdbUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;
    
    const response = await fetch(omdbUrl);
    const data = await response.json();

    if (data.Response === "False") {
      return res.status(404).json({ error: "Filmul nu a fost găsit în baza de date OMDB." });
    }

    res.json(data);

  } catch (error) {
    console.error("Eroare la procesarea filmului:", error.message);
    res.status(500).json({ error: "Eroare la comunicarea cu baza de date de filme." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serverul rulează pe portul ${PORT}`);
});