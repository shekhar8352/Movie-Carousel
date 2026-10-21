import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  formatRating,
  getFavourites,
  getMovieTitle,
  getPosterUrl,
  getPrimaryGenre,
  setFavourites,
} from "../movieUtils";

export default class Favourite extends Component {
  constructor() {
    super();
    this.state = {
      genres: [],
      currgen: "All Genres",
      movies: [],
      currText: "",
      limit: 5,
      currPage: 1,
    };
  }

  componentDidMount() {
    this.loadFavourites();
  }

  loadFavourites = () => {
    const data = getFavourites();
    const temp = [];
    data.forEach((movieObj) => {
      const genre = getPrimaryGenre(movieObj);
      if (!temp.includes(genre)) {
        temp.push(genre);
      }
    });
    temp.unshift("All Genres");
    this.setState({
      genres: [...temp],
      movies: [...data],
    });
  };

  handleGenreChange = (genre) => {
    this.setState({
      currgen: genre,
      currPage: 1,
    });
  };

  sortBy = (key, direction) => {
    const temp = [...this.state.movies];
    temp.sort((objA, objB) =>
      direction === "desc" ? objB[key] - objA[key] : objA[key] - objB[key]
    );
    this.setState({ movies: temp });
  };

  handlePageChange = (page) => {
    this.setState({
      currPage: page,
    });
  };

  handleDelete = (id) => {
    const newarr = this.state.movies.filter((movieObj) => movieObj.id !== id);
    setFavourites(newarr);
    const nextGenres = ["All Genres"];
    newarr.forEach((movieObj) => {
      const genre = getPrimaryGenre(movieObj);
      if (!nextGenres.includes(genre)) {
        nextGenres.push(genre);
      }
    });
    this.setState((prev) => ({
      movies: newarr,
      genres: nextGenres,
      currgen: nextGenres.includes(prev.currgen) ? prev.currgen : "All Genres",
      currPage: 1,
    }));
  };

  getFilteredMovies = () => {
    let filterarr = this.state.movies;

    if (this.state.currText !== "") {
      filterarr = filterarr.filter((movieObj) => {
        const title = getMovieTitle(movieObj).toLowerCase();
        return title.includes(this.state.currText.toLowerCase());
      });
    }

    if (this.state.currgen !== "All Genres") {
      filterarr = filterarr.filter(
        (movieObj) => getPrimaryGenre(movieObj) === this.state.currgen
      );
    }

    return filterarr;
  };

  render() {
    const limit = Math.max(1, Number(this.state.limit) || 5);
    const filtered = this.getFilteredMovies();
    const pages = Math.max(1, Math.ceil(filtered.length / limit));
    const currPage = Math.min(this.state.currPage, pages);
    const si = (currPage - 1) * limit;
    const pageItems = filtered.slice(si, si + limit);
    const pagesarr = [];
    for (let i = 1; i <= pages; i++) {
      pagesarr.push(i);
    }

    return (
      <section className="section">
        <div className="section-header">
          <div>
            <h2>Your favourites</h2>
            <p>
              {this.state.movies.length} saved{" "}
              {this.state.movies.length === 1 ? "title" : "titles"}. Search, filter, and sort your watchlist.
            </p>
          </div>
        </div>

        {this.state.movies.length === 0 ? (
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
                {this.state.genres.map((genre) => (
                  <button
                    type="button"
                    key={genre}
                    className={`genre-chip${this.state.currgen === genre ? " active" : ""}`}
                    onClick={() => this.handleGenreChange(genre)}
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
                    value={this.state.currText}
                    onChange={(e) =>
                      this.setState({ currText: e.target.value, currPage: 1 })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="rows-count">Rows</label>
                  <select
                    id="rows-count"
                    value={limit}
                    onChange={(e) =>
                      this.setState({
                        limit: Number(e.target.value),
                        currPage: 1,
                      })
                    }
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
                              <button type="button" className="sort-caret" onClick={() => this.sortBy("popularity", "desc")} aria-label="Sort popularity high to low">↑</button>
                              <button type="button" className="sort-caret" onClick={() => this.sortBy("popularity", "asc")} aria-label="Sort popularity low to high">↓</button>
                            </span>
                          </th>
                          <th scope="col">
                            <span className="sort-btn">
                              Rating
                              <button type="button" className="sort-caret" onClick={() => this.sortBy("vote_average", "desc")} aria-label="Sort rating high to low">↑</button>
                              <button type="button" className="sort-caret" onClick={() => this.sortBy("vote_average", "asc")} aria-label="Sort rating low to high">↓</button>
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
                                  onClick={() => this.handleDelete(movieObj.id)}
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
                        {pagesarr.map((page) => (
                          <li key={page}>
                            <button
                              className={`page-btn${page === currPage ? " active" : ""}`}
                              type="button"
                              onClick={() => this.handlePageChange(page)}
                            >
                              {page}
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
}
