import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  FAVOURITES_EVENT,
  formatRating,
  getFavourites,
  getMovieTitle,
  getMovieYear,
  getPosterUrl,
  isFavourite,
  toggleFavourite,
} from "../movieUtils";

const TMDB_POPULAR =
  "https://api.themoviedb.org/3/movie/popular?api_key=5540e483a20e0b20354dabc2d66a31c9&language=en-US";

export default function Movies() {
  const [parr, setParr] = useState([1]);
  const [currPage, setCurrPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState(() =>
    getFavourites().map((movie) => movie.id)
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const syncFavourites = useCallback(() => {
    setFavourites(getFavourites().map((movie) => movie.id));
  }, []);

  useEffect(() => {
    window.addEventListener(FAVOURITES_EVENT, syncFavourites);
    return () => window.removeEventListener(FAVOURITES_EVENT, syncFavourites);
  }, [syncFavourites]);

  useEffect(() => {
    let cancelled = false;

    const loadMovies = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${TMDB_POPULAR}&page=${currPage}`);
        if (!cancelled) {
          setMovies(res.data.results || []);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setLoading(false);
          setError("Could not load trending movies. Please try again.");
        }
      }
    };

    loadMovies();
    return () => {
      cancelled = true;
    };
  }, [currPage]);

  const handleRight = () => {
    const nextPage = currPage + 1;
    setParr(Array.from({ length: Math.max(parr.length, nextPage) }, (_, i) => i + 1));
    setCurrPage(nextPage);
  };

  const handleLeft = () => {
    if (currPage !== 1) {
      setCurrPage(currPage - 1);
    }
  };

  const handleClick = (value) => {
    if (value !== currPage) {
      setCurrPage(value);
    }
  };

  const handleFavourites = (movie) => {
    toggleFavourite(movie);
    syncFavourites();
  };

  return (
    <section className="section" id="trending">
      <div className="section-header">
        <div>
          <h2>Trending movies</h2>
          <p>Popular titles this week. Save anything you want to watch later.</p>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading && movies.length === 0 ? (
        <div className="skeleton-grid" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, index) => (
            <div className="skeleton-card" key={index} />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="empty-state">
          <h3>No movies to show</h3>
          <p>Trending titles could not be loaded right now.</p>
        </div>
      ) : (
        <>
          <div className="movies-grid">
            {movies.map((movieObj) => {
              const title = getMovieTitle(movieObj);
              const poster = getPosterUrl(movieObj);
              const saved = favourites.includes(movieObj.id) || isFavourite(movieObj.id);

              return (
                <article className="movie-card" key={movieObj.id}>
                  <div className="poster-wrap">
                    {poster ? (
                      <img src={poster} alt={title} />
                    ) : (
                      <div className="poster-fallback">{title.charAt(0)}</div>
                    )}
                    <span className="rating-badge">★ {formatRating(movieObj.vote_average)}</span>
                    <button
                      className={`fav-toggle${saved ? " active" : ""}`}
                      type="button"
                      aria-label={saved ? `Remove ${title} from favourites` : `Add ${title} to favourites`}
                      onClick={() => handleFavourites(movieObj)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"}>
                        <path
                          d="M12 20s-7-4.4-9.5-8.2C.6 8.7 2.2 5 6 5c2 0 3.3 1.1 4 2.1C10.7 6.1 12 5 14 5c3.8 0 5.4 3.7 3.5 6.8C19 15.6 12 20 12 20z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="movie-card-body">
                    <h3>{title}</h3>
                    <p>{getMovieYear(movieObj) || "Release TBA"}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <nav aria-label="Movie pages">
            <ul className="pagination">
              <li>
                <button
                  className="page-btn"
                  type="button"
                  onClick={handleLeft}
                  disabled={currPage === 1}
                >
                  Previous
                </button>
              </li>
              {parr.map((value) => (
                <li key={value}>
                  <button
                    className={`page-btn${value === currPage ? " active" : ""}`}
                    type="button"
                    onClick={() => handleClick(value)}
                    aria-current={value === currPage ? "page" : undefined}
                  >
                    {value}
                  </button>
                </li>
              ))}
              <li>
                <button className="page-btn" type="button" onClick={handleRight}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </section>
  );
}
