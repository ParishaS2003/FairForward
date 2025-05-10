import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(cors());
app.use(express.json());

// Proxy endpoint for geocoding
app.get('/api/geocode', async (req, res) => {
  try {
    const { address } = req.query;
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          format: 'json',
          q: address
        },
        headers: {
          'User-Agent': 'FairForward/1.0 (https://fairforward.org; contact@fairforward.org)',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ error: 'Geocoding failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
}); 