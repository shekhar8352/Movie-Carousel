import React, { Component } from "react";
import axios from "axios";

export default class Banner extends Component {
  constructor()
  {
    super();
    this.state = {
      movies:[],
    }
  }

  async componentDidMount() {
    const res = await axios.get(
      "https://api.themoviedb.org/3/trending/all/day?api_key=d8f2eb6b526f4cf3546be62aebe80c59"
    );
    let data = res.data;
    this.setState({
      movies: [...data.results],
    });
  }

  render() {
    return (
      <div>
        <div
          id="carouselExampleSlidesOnly"
          class="carousel slide"
          data-bs-ride="carousel"
        >
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img src="" class="d-block w-100" alt="..." />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
