import "./App.css";
import Navbar from "./Components/Navbar";
import Banner from "./Components/Banner";
import Movies from "./Components/Movies";
import Favourite from "./Components/favourite";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="app-shell">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favourites" element={<Favourite />} />
          </Routes>
        </main>
        <footer className="site-footer">
          Movie Carousel · Browse trending titles and keep a personal watchlist.
        </footer>
      </div>
    </Router>
  );
}

export default App;

function Home() {
  return (
    <>
      <Banner />
      <Movies />
    </>
  );
}
