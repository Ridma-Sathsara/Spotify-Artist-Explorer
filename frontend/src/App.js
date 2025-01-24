import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Importing the search icon from react-icons
import ArtistInfo from "./components/ArtistInfo";
import ArtistTopTracks from "./components/ArtistTopTracks";
import ArtistAlbums from "./components/ArtistAlbums";
import './App.css';

function App() {
  const [artistId, setArtistId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/search/artist?q=${searchTerm}`
      );
      const data = await response.json();

      if (data.length === 0) {
        setError("No artist found with this name.");
        return;
      }

      const artist = data[0]; // Select the first result or implement a UI to let the user choose
      setArtistId(artist.id);
    } catch (err) {
      setError("Failed to search for artist. Please try again.");
    }
  };

  return (
    <div>
      <header className="app-bar">
        {/* Search bar with icon */}
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-bar-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search for Artists"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
      </header>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {artistId && (
        <div style={{ padding: "2rem" }}>
          <ArtistInfo artistId={artistId} />
          <ArtistTopTracks artistId={artistId} />
          <ArtistAlbums artistId={artistId} />
        </div>
      )}
    </div>
  );
}

export default App;
