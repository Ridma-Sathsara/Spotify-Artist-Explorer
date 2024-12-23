const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow Cross-Origin Requests

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// Function to get Spotify API Access Token
const getAccessToken = async () => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({ grant_type: 'client_credentials' }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error.response?.data || error.message);
    throw new Error('Unable to retrieve access token');
  }
};

// Fetch Artist by Name
app.get('/api/search/artist', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const artistName = req.query.q;

    if (!artistName) {
      return res.status(400).json({ error: 'Artist name is required' });
    }

    const response = await axios.get(
      `https://api.spotify.com/v1/search`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: artistName,
          type: 'artist',
          limit: 10, // Adjust the limit as needed
        },
      }
    );

    res.json(response.data.artists.items); // Return the list of matching artists
  } catch (error) {
    console.error('Error searching for artist:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to search for artist' });
  }
});

// Fetch Artist Information by ID
app.get('/api/artist/:artistId', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const artistId = req.params.artistId;

    const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching artist data:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch artist data' });
  }
});

// Fetch Artist's Top Tracks
app.get('/api/artist/:artistId/top-tracks', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const artistId = req.params.artistId;

    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json(response.data.tracks); // Return track URIs to the frontend
  } catch (error) {
    console.error('Error fetching top tracks:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch top tracks' });
  }
});

// Fetch Artist's Albums
app.get('/api/artist/:artistId/albums', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const artistId = req.params.artistId;

    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,compilation&market=US`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json(response.data.items);
  } catch (error) {
    console.error('Error fetching albums:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
