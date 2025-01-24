import React, { useState, useEffect } from 'react';
import './../styles/ArtistInfo.css';

const ArtistInfo = ({ artistId }) => {
  const [artistData, setArtistData] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const [artistRes, albumRes] = await Promise.all([
          fetch(`http://localhost:5000/api/artist/${artistId}`),
          fetch(`http://localhost:5000/api/artist/${artistId}/albums`),
        ]);

        if (!artistRes.ok || !albumRes.ok) {
          throw new Error('Failed to fetch artist or album data');
        }

        const artistData = await artistRes.json();
        const albumData = await albumRes.json();

        setArtistData(artistData);
        setAlbums(albumData);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [artistId]);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;

  const coverPhoto = albums[0]?.images[0]?.url || 'https://via.placeholder.com/800x400';

  return (
    <div className="artist-info-container">
      {/* Cover Photo */}
      <div
        className="artist-cover-photo"
        style={{
          backgroundImage: `url(${coverPhoto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '650px',
        }}
      >
        {/* Artist details with profile photo */}
        <div className="artist-info-overlay">
          <img
            className="artist-image-overlay"
            src={artistData.images[0]?.url || 'https://via.placeholder.com/200'}
            alt={artistData.name}
          />
          <div className="artist-text-details">
            <h1 className="artist-name">{artistData.name}</h1>
            <p className="artist-followers">{artistData.followers.total.toLocaleString()} followers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistInfo;
