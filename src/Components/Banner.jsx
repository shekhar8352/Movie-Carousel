import React, { Component } from "react";
import { movies } from "./AddMovies";

export default class Banner extends Component {
  render() {
    let x = Math.floor(Math.random() * 20);
    let movie = movies.results[x];

    return (

      <>
      {
        movie === "" ?
        <div>
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
        :
        <div>
          <div className="card banner-card">
            <img src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt={movie.title} className="banner-img" />
            <div className="card-body">
              <h3 className="card-title banner-title">{movie.title}</h3>
              <p className="card-text banner-text">
                {movie.overview}
              </p>
            </div>
          </div>
        </div>
      }
      </>
    );
  }
}
