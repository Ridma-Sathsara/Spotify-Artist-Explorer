import React, { useState } from "react";
import ArtistInfo from "./components/ArtistInfo";
import ArtistTopTracks from "./components/ArtistTopTracks";
import ArtistAlbums from "./components/ArtistAlbums";

function App() {
  const [artistId, setArtistId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`http://localhost:5000/api/search/artist?q=${searchTerm}`);
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
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Spotify Artist Info</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter Artist Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", width: "250px" }}
        />
        <button type="submit" style={{ marginLeft: "1rem", padding: "0.5rem" }}>
          Search
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {artistId && (
        <>
          <ArtistInfo artistId={artistId} />
          <ArtistTopTracks artistId={artistId} />
          <ArtistAlbums artistId={artistId} />
        </>
      )}
    </div>
  );
}

export default App;
