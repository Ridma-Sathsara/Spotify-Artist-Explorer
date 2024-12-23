import React, { useState, useEffect } from 'react';
import './../styles/ArtistAlbums.css';

const ArtistAlbums = ({ artistId }) => {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/artist/${artistId}/albums`);
        const data = await response.json();
        setAlbums(data);
      } catch (err) {
        setError('Failed to fetch albums');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [artistId]);

  if (loading) return <p>Loading albums...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="album-container">
      <h2 className="album-header">Albums</h2>
      <div className="album-grid">
        {albums.map((album) => (
          <div className="album-card" key={album.id}>
            <img
              className="album-cover"
              src={album.images[0]?.url || 'https://via.placeholder.com/150'}
              alt={album.name}
            />
            <div className="album-info">
              <p className="album-name">{album.name}</p>
              <p className="album-release">{new Date(album.release_date).getFullYear()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistAlbums;
