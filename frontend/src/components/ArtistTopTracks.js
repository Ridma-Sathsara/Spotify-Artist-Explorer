import React, { useState, useEffect } from "react";
import './../styles/ArtistTopTracks.css';

const ArtistTopTracks = ({ artistId }) => {
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/artist/${artistId}/top-tracks`);
        const data = await response.json();
        setTracks(data);
      } catch (err) {
        setError('Failed to fetch top tracks');
      } finally {
        setLoading(false);
      }
    };

    fetchTopTracks();
  }, [artistId]);

  const playTrack = (track) => {
    if (!track.external_urls?.spotify) {
      alert("No Spotify URL available for this track");
      return;
    }

    // Redirect the user to the Spotify track page
    window.open(track.external_urls.spotify, '_blank');
  };

  if (loading) return <p>Loading top tracks...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="top-tracks-container">
      <h2 className="section-title">Popular</h2>
      <ul className="track-list">
        {tracks.map((track, index) => (
          <li key={track.id} className="track-item">
            <span className="track-number">{index + 1}</span>
            <img
              className="track-album-image"
              src={track.album.images[0]?.url}
              alt={track.album.name}
            />
            <div className="track-info">
              <strong className="track-name">{track.name}</strong>
              <p className="track-album-name">{track.album.name}</p>
            </div>
            <div className="track-duration">
              {new Date(track.duration_ms).toISOString().substr(14, 5)}
            </div>
            <button onClick={() => playTrack(track)}>
              Play on Spotify
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArtistTopTracks;
