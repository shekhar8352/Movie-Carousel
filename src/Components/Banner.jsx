import React, { Component } from "react";
import { movies } from "./AddMovies";
import {
  FAVOURITES_EVENT,
  formatRating,
  getBackdropUrl,
  getMovieTitle,
  getMovieYear,
  getPrimaryGenre,
  isFavourite,
  toggleFavourite,
} from "../movieUtils";

export default class Banner extends Component {
  constructor() {
    super();
    const catalog = (movies.results || []).filter(
      (item) => item.backdrop_path || item.poster_path
    );
    const featured = catalog[Math.floor(Math.random() * catalog.length)] || catalog[0];
    this.state = {
      movie: featured || null,
      saved: featured ? isFavourite(featured.id) : false,
    };
  }

  syncFavourite = () => {
    const { movie } = this.state;
    if (!movie) return;
    this.setState({ saved: isFavourite(movie.id) });
  };

  componentDidMount() {
    window.addEventListener(FAVOURITES_EVENT, this.syncFavourite);
  }

  componentWillUnmount() {
    window.removeEventListener(FAVOURITES_EVENT, this.syncFavourite);
  }

  handleFavourite = () => {
    const { movie } = this.state;
    if (!movie) return;
    toggleFavourite(movie);
  };

  render() {
    const { movie, saved } = this.state;

    if (!movie) {
      return (
        <div className="loader">
          <div className="spinner" aria-label="Loading featured movie" />
        </div>
      );
    }

    const title = getMovieTitle(movie);
    const year = getMovieYear(movie);
    const backdrop = getBackdropUrl(movie);

    return (
      <section className="hero" aria-label="Featured movie">
        <div className="hero-media">
          {backdrop ? (
            <img src={backdrop} alt="" />
          ) : (
            <div className="poster-fallback">{title.charAt(0)}</div>
          )}
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="eyebrow">Now trending</div>
          <h1 className="hero-title">{title}</h1>
          <div className="hero-meta">
            <span className="chip gold">★ {formatRating(movie.vote_average)}</span>
            {year && <span className="chip">{year}</span>}
            <span className="chip">{getPrimaryGenre(movie)}</span>
          </div>
          <p className="hero-text">{movie.overview}</p>
          <div className="hero-actions">
            <button className="btn btn-primary" type="button" onClick={this.handleFavourite}>
              {saved ? "Remove from favourites" : "Add to favourites"}
            </button>
            <a className="btn btn-ghost" href="#trending">
              Browse trending
            </a>
          </div>
        </div>
      </section>
    );
  }
}
