import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  formatRating,
  getFavourites,
  getMovieTitle,
  getPosterUrl,
  getPrimaryGenre,
  setFavourites,
} from "../movieUtils";

function genresFromMovies(movieList) {
  const nextGenres = ["All Genres"];
  movieList.forEach((movieObj) => {
    const genre = getPrimaryGenre(movieObj);
    if (!nextGenres.includes(genre)) {
      nextGenres.push(genre);
    }
  });
  return nextGenres;
}

export default function Favourite() {
  const [currgen, setCurrgen] = useState("All Genres");
  const [movies, setMovies] = useState([]);
  const [currText, setCurrText] = useState("");
  const [limit, setLimit] = useState(5);
  const [currPage, setCurrPage] = useState(1);

  useEffect(() => {
    setMovies(getFavourites());
  }, []);

  const genres = useMemo(() => genresFromMovies(movies), [movies]);

  useEffect(() => {
    if (!genres.includes(currgen)) {
      setCurrgen("All Genres");
    }
  }, [genres, currgen]);

  const handleGenreChange = (genre) => {
    setCurrgen(genre);
    setCurrPage(1);
  };

  const sortBy = (key, direction) => {
    setMovies((current) => {
      const next = [...current];
      next.sort((objA, objB) =>
        direction === "desc" ? objB[key] - objA[key] : objA[key] - objB[key]
      );
      return next;
    });
  };

  const handleDelete = (id) => {
    const newarr = movies.filter((movieObj) => movieObj.id !== id);
    setFavourites(newarr);
    setMovies(newarr);
    setCurrPage(1);
  };

  const filtered = movies.filter((movieObj) => {
    const matchesSearch =
      currText === "" ||
      getMovieTitle(movieObj).toLowerCase().includes(currText.toLowerCase());
    const matchesGenre =
      currgen === "All Genres" || getPrimaryGenre(movieObj) === currgen;
    return matchesSearch && matchesGenre;
  });

  const safeLimit = Math.max(1, Number(limit) || 5);
  const pages = Math.max(1, Math.ceil(filtered.length / safeLimit));
  const page = Math.min(currPage, pages);
  const pageItems = filtered.slice((page - 1) * safeLimit, page * safeLimit);
  const pagesarr = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <h2>Your favourites</h2>
          <p>
            {movies.length} saved {movies.length === 1 ? "title" : "titles"}. Search,
            filter, and sort your watchlist.
          </p>
        </div>
      </div>

      {movies.length === 0 ? (
        <div className="empty-state">
          <h3>No favourites yet</h3>
          <p>Browse trending movies and tap the heart to save titles you want to watch.</p>
          <Link className="btn btn-primary" to="/">
            Browse trending
          </Link>
        </div>
      ) : (
        <div className="favourites-layout">
          <aside className="genre-panel">
            <h3>Genres</h3>
            <div className="genre-list">
              {genres.map((genre) => (
                <button
                  type="button"
                  key={genre}
                  className={`genre-chip${currgen === genre ? " active" : ""}`}
                  onClick={() => handleGenreChange(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </aside>

          <div className="favourites-panel">
            <div className="toolbar">
              <div className="field">
                <label htmlFor="favourite-search">Search</label>
                <input
                  id="favourite-search"
                  type="search"
                  placeholder="Search by title"
                  value={currText}
                  onChange={(e) => {
                    setCurrText(e.target.value);
                    setCurrPage(1);
                  }}
                />
              </div>
              <div className="field">
                <label htmlFor="rows-count">Rows</label>
                <select
                  id="rows-count"
                  value={safeLimit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setCurrPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>

            {pageItems.length === 0 ? (
              <div className="empty-state">
                <h3>No matching titles</h3>
                <p>Try a different search or genre filter.</p>
              </div>
            ) : (
              <>
                <div className="favourites-table-wrap">
                  <table className="favourites-table">
                    <thead>
                      <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Genre</th>
                        <th scope="col">
                          <span className="sort-btn">
                            Popularity
                            <button type="button" className="sort-caret" onClick={() => sortBy("popularity", "desc")} aria-label="Sort popularity high to low">↑</button>
                            <button type="button" className="sort-caret" onClick={() => sortBy("popularity", "asc")} aria-label="Sort popularity low to high">↓</button>
                          </span>
                        </th>
                        <th scope="col">
                          <span className="sort-btn">
                            Rating
                            <button type="button" className="sort-caret" onClick={() => sortBy("vote_average", "desc")} aria-label="Sort rating high to low">↑</button>
                            <button type="button" className="sort-caret" onClick={() => sortBy("vote_average", "asc")} aria-label="Sort rating low to high">↓</button>
                          </span>
                        </th>
                        <th scope="col">
                          <span className="visually-hidden">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((movieObj) => {
                        const title = getMovieTitle(movieObj);
                        const poster = getPosterUrl(movieObj, "w185");
                        return (
                          <tr key={movieObj.id}>
                            <td>
                              <div className="title-cell">
                                {poster ? (
                                  <img src={poster} alt="" />
                                ) : (
                                  <div className="title-fallback">{title.charAt(0)}</div>
                                )}
                                <strong>{title}</strong>
                              </div>
                            </td>
                            <td>{getPrimaryGenre(movieObj)}</td>
                            <td>{Math.round(movieObj.popularity)}</td>
                            <td>{formatRating(movieObj.vote_average)}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(movieObj.id)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {pages > 1 && (
                  <nav aria-label="Favourites pages">
                    <ul className="pagination">
                      {pagesarr.map((pageNumber) => (
                        <li key={pageNumber}>
                          <button
                            className={`page-btn${pageNumber === page ? " active" : ""}`}
                            type="button"
                            onClick={() => setCurrPage(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
