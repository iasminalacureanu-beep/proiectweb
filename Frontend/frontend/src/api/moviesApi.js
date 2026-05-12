const BACKEND_URL = 'https://proiectweb-backend-6o4t.onrender.com';
export async function searchMovie(title) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/movies/search`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Eroare server: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Eroare la căutare:", error);
    throw error;
  }
}