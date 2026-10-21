export const FAVOURITES_KEY = "movies-app";
export const FAVOURITES_EVENT = "favourites-updated";

export const GENRE_NAMES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10765: "Sci-Fi",
  10759: "Action",
};

export function getMovieTitle(movie) {
  if (!movie) return "Untitled";
  return (
    movie.title ||
    movie.original_title ||
    movie.name ||
    movie.original_name ||
    "Untitled"
  );
}

export function getMovieYear(movie) {
  const date = movie?.release_date || movie?.first_air_date || "";
  return date ? date.slice(0, 4) : "";
}

export function getPosterUrl(movie, size = "w500") {
  const path = movie?.poster_path || movie?.backdrop_path;
  if (!path) return "";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getBackdropUrl(movie, size = "original") {
  const path = movie?.backdrop_path || movie?.poster_path;
  if (!path) return "";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getPrimaryGenre(movie) {
  const id = movie?.genre_ids?.[0];
  return GENRE_NAMES[id] || "Unknown";
}

export function formatRating(value) {
  if (value == null || Number.isNaN(Number(value))) return "–";
  return Number(value).toFixed(1);
}

export function getFavourites() {
  try {
    const parsed = JSON.parse(localStorage.getItem(FAVOURITES_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setFavourites(movies) {
  localStorage.setItem(FAVOURITES_KEY, JSON.stringify(movies));
  window.dispatchEvent(new Event(FAVOURITES_EVENT));
}

export function toggleFavourite(movie) {
  const current = getFavourites();
  const exists = current.some((item) => item.id === movie.id);
  const next = exists
    ? current.filter((item) => item.id !== movie.id)
    : [...current, movie];
  setFavourites(next);
  return { next, added: !exists };
}

export function isFavourite(id) {
  return getFavourites().some((item) => item.id === id);
}
