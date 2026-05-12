import { useState } from "react";
import { searchMovie } from "./api/moviesApi";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");
    setMovie(null);

    try {
      const data = await searchMovie(searchTerm);
      setMovie(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendation = (ratingStr) => {
    if (!ratingStr || ratingStr === "N/A") return { text: "Rating indisponibil.", color: "text-gray-500" };
    
    const rating = parseFloat(ratingStr); 
    if (rating >= 8.0) {
      return { text: "Ar trebui să vizionați acest film chiar acum!", color: "text-green-600 bg-green-100 border-green-300" };
    } else if (rating < 5.0) {
      return { text: "Evitați acest film cu orice preț!", color: "text-red-600 bg-red-100 border-red-300" };
    } else {
      return { text: "Un film decent, merită văzut dacă îți place genul.", color: "text-blue-600 bg-blue-100 border-blue-300" };
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-brand mb-8 text-center">Caută un film</h1>
        
       
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
         <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Introdu numele unui film (ex: The Matrix)..."
            className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-800 text-white placeholder-violet-400 focus:border-brand focus:outline-none"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-3 bg-brand text-white font-bold italic rounded-lg hover:bg-brand-dark transition-color-violet"
          >
            {loading ? "Se caută..." : "Caută"}
          </button>
        </form>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center font-medium border border-red-300">
            {error}
          </div>
        )}

        {movie && (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100 ">
            {/* Poster Film */}
            {movie.Poster !== "N/A" ? (
              <img src={movie.Poster} alt={movie.Title} className="w-full md:w-1/3 object-cover" />
            ) : (
              <div className="w-full md:w-1/3 bg-gray-200 flex items-center justify-center text-gray-500">
                Fără imagine
              </div>
            )}
            
             <div className="p-6 flex flex-col flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{movie.Title} ({movie.Year})</h2>
              <div className="flex gap-4 text-sm text-gray-600 mb-4 font-semibold">
                <span className="bg-gray-100 px-2 py-1 rounded">Rating: {movie.imdbRating}/10</span>
                <span className="bg-gray-100 px-2 py-1 rounded">{movie.Runtime}</span>
                <span className="bg-gray-100 px-2 py-1 rounded">{movie.Genre}</span>
              </div>
              
              <p className="text-gray-700 mb-6 italic border-l-4 border-brand pl-3">
                {movie.Plot}
              </p>

              <div className="mt-auto">
                <p className="text-sm text-gray-500 mb-1 font-semibold">Recomandarea noastră:</p>
                <div className={`p-4 rounded-lg border-2 font-bold text-center ${getRecommendation(movie.imdbRating).color}`}>
                  {getRecommendation(movie.imdbRating).text}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}