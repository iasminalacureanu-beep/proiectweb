export async function searchMovie(title) {
  const response = await fetch("/api/movies/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Nu s-a putut găsi filmul.");
  }

  return response.json();
}
