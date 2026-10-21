import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FAVOURITES_EVENT, getFavourites } from "../movieUtils";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [favCount, setFavCount] = useState(() => getFavourites().length);

  useEffect(() => {
    const syncFavourites = () => setFavCount(getFavourites().length);
    window.addEventListener(FAVOURITES_EVENT, syncFavourites);
    window.addEventListener("storage", syncFavourites);
    return () => {
      window.removeEventListener(FAVOURITES_EVENT, syncFavourites);
      window.removeEventListener("storage", syncFavourites);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-nav">
      <div className="site-nav-inner">
        <NavLink className="brand" to="/" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="3" stroke="white" strokeWidth="1.8" />
              <path d="M8 5v14M16 5v14M3 9h18M3 15h18" stroke="white" strokeWidth="1.8" />
            </svg>
          </span>
          Movie Carousel
        </NavLink>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <nav className={`nav-links${menuOpen ? " open" : ""}`} aria-label="Primary">
          <NavLink className="nav-link" to="/" end onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink className="nav-link" to="/favourites" onClick={closeMenu}>
            Favourites
            {favCount > 0 && <span className="fav-count">{favCount}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
