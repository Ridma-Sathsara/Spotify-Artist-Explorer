import React, { useState, useEffect } from 'react';
import './../styles/ArtistInfo.css';

const ArtistInfo = ({ artistId }) => {
  const [artistData, setArtistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:5000/api/artist/${artistId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch artist data');
        }
        const data = await response.json();
        setArtistData(data);
      } catch (err) {
        setError('Failed to fetch artist data');
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [artistId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="artist-info-container">
      <div className="artist-header">
        <img
          className="artist-image"
          src={artistData.images[0]?.url || 'https://via.placeholder.com/200'}
          alt={artistData.name}
        />
        <div className="artist-details">
          <h1 className="artist-name">{artistData.name}</h1>
          <p className="artist-genres">
            {artistData.genres.map((genre, index) => (
              <span key={index}>{genre}{index < artistData.genres.length - 1 ? ', ' : ''}</span>
            ))}
          </p>
          <p className="artist-followers">{artistData.followers.total.toLocaleString()} followers</p>
          <p className="artist-popularity">Popularity: {artistData.popularity}%</p>
        </div>
      </div>
    </div>
  );
};

export default ArtistInfo;
