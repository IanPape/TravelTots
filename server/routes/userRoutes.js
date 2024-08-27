const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { User, Folder, Playground, FolderPlaygrounds, sequelize } = require('../models'); // Import sequelize here
require('dotenv').config();
console.log('Using API key:', process.env.GOOGLE_API_KEY);

// Middleware to authenticate and extract user ID from JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expecting "Bearer <token>"
  
  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user; // Attach the decoded user info to the request object
    next();
  });
};

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('Registering user:', username, email);

    // Do not hash the password here; pass it directly to User.create
    const newUser = await User.create({ username, email, password });
    console.log('User created:', newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(400).json({ error: error.message });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`Attempting to log in user: ${username}`);
    const trimmedPassword = password.trim();
    console.log('Trimmed password during login:', trimmedPassword);

    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Stored hashed password:', user.password);

    const isPasswordValid = await bcrypt.compare(trimmedPassword, user.password);
    console.log('Password comparison result:', isPasswordValid);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(400).json({ error: error.message });
  }
});

// Fetch playgrounds, Handle POST requests to the '/playgrounds' endpoint
router.post('/playgrounds', async (req, res) => {
  const { latitude, longitude, travelTime } = req.body;

  try {
    const placesApiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;

    let allResults = [];  // Array to store all playground results

    // Define radius values in meters for different travel times
    const radii = [10000, 20000, 30000];  // Example: 10km, 20km, 30km

    for (let radius of radii) {
      let nextPageToken = null;

      // Fetch playgrounds for each radius
      do {
        const response = await axios.get(placesApiUrl, {
          params: {
            location: `${latitude},${longitude}`,
            radius,
            keyword: 'playground kids',
            key: process.env.GOOGLE_API_KEY,
            pagetoken: nextPageToken
          }
        });

        allResults = allResults.concat(response.data.results);  // Accumulate results
        nextPageToken = response.data.next_page_token;  // Update token for the next page, if any

        if (nextPageToken) {
          await new Promise(resolve => setTimeout(resolve, 2000));  // Wait before fetching the next page
        }

      } while (nextPageToken);  // Continue until all pages are fetched
    }

    console.log('Combined Playgrounds:', allResults.map(pg => pg.name));

    // Ensure all unique playgrounds are captured
    const uniquePlaygrounds = allResults.reduce((unique, pg) => {
      if (!unique.some(item => item.place_id === pg.place_id)) {
        unique.push(pg);
      }
      return unique;
    }, []);

    const maxDestinationsPerRequest = 25;
    const destinationBatches = [];
    for (let i = 0; i < uniquePlaygrounds.length; i += maxDestinationsPerRequest) {
      destinationBatches.push(uniquePlaygrounds.slice(i, i + maxDestinationsPerRequest));
    }

    let filteredPlaygrounds = [];

    // Calculate travel times and filter results based on travel time criteria
    for (let batch of destinationBatches) {
      const destinations = batch.map(pg => `${pg.geometry.location.lat},${pg.geometry.location.lng}`).join('|');
      const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: {
          origins: `${latitude},${longitude}`,
          destinations,
          mode: 'driving',
          departure_time: 'now',
          key: process.env.GOOGLE_API_KEY
        }
      });

      response.data.rows[0].elements.forEach((element, index) => {
        if (element.status === 'OK') {
          const travelTimeInMinutes = Math.ceil(element.duration.value / 60);
          const playground = batch[index];

          if (travelTimeInMinutes <= travelTime) {
            filteredPlaygrounds.push({
              ...playground,
              travelTime: travelTimeInMinutes,
              mapsLink: `https://www.google.com/maps/search/?api=1&query=${playground.geometry.location.lat},${playground.geometry.location.lng}`
            });
          }
        }
      });
    }

    // Sort the final list by travel time to ensure closest playgrounds appear first
    filteredPlaygrounds.sort((a, b) => a.travelTime - b.travelTime);

    console.log('Final Playgrounds Sent to Frontend:', filteredPlaygrounds.map(pg => ({
      name: pg.name,
      travelTime: pg.travelTime,
      mapsLink: pg.mapsLink
    })));

    res.json(filteredPlaygrounds);

  } catch (error) {
    console.error('Error fetching playgrounds:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch playgrounds' });
  }
});

// Create a new folder (protected)
router.post('/folders', authenticateToken, async (req, res) => {
  const { name } = req.body;

  try {
    const folder = await Folder.create({ user_id: req.user.userId, name });
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save a playground to a folder (protected)
router.post('/playgrounds/save', authenticateToken, async (req, res) => {
  const { folderId, playground } = req.body;

  try {
    const folder = await Folder.findOne({ where: { id: folderId, user_id: req.user.userId } });

    if (!folder) {
      return res.status(403).json({ error: 'Forbidden: You do not own this folder' });
    }

    let existingPlayground = await Playground.findOne({
      where: {
        name: playground.name,
        latitude: playground.geometry.location.lat,
        longitude: playground.geometry.location.lng
      }
    });

    if (!existingPlayground) {
      existingPlayground = await Playground.create({
        name: playground.name,
        latitude: playground.geometry.location.lat,
        longitude: playground.geometry.location.lng,
        map_link: playground.mapsLink,
      });
    }

    await FolderPlaygrounds.create({
      folder_id: folderId,
      playground_id: existingPlayground.id
    });

    res.status(201).json({ message: 'Playground saved successfully' });
  } catch (error) {
    console.error('Error saving playground:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Fetch folders for a specific user (protected)
router.get('/folders/:userId', authenticateToken, async (req, res) => {
  const userId = req.params.userId;

  if (req.user.userId !== parseInt(userId)) {
    return res.sendStatus(403); // Forbidden: User ID in token does not match requested user ID
  }

  try {
    const folders = await Folder.findAll({
      where: { user_id: userId },
      include: [{ model: sequelize.models.Playground, as: 'playgrounds' }]
    });
    res.status(200).json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Error fetching folders' });
  }
});

// Delete a folder (protected)
router.delete('/folders/:folderId', authenticateToken, async (req, res) => {
  const folderId = req.params.folderId;

  try {
    const folder = await Folder.findOne({ where: { id: folderId, user_id: req.user.userId } });

    if (!folder) {
      return res.status(403).json({ error: 'Forbidden: You do not own this folder' });
    }

    await FolderPlaygrounds.destroy({ where: { folder_id: folderId } });
    await folder.destroy();

    res.status(200).json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ error: 'Failed to delete folder' });
  }
});

// Delete a playground from a folder (protected)
router.delete('/folders/:folderId/playgrounds/:playgroundId', authenticateToken, async (req, res) => {
  const { folderId, playgroundId } = req.params;

  try {
    const folder = await Folder.findOne({ where: { id: folderId, user_id: req.user.userId } });

    if (!folder) {
      return res.status(403).json({ error: 'Forbidden: You do not own this folder' });
    }

    const association = await FolderPlaygrounds.findOne({
      where: {
        folder_id: folderId,
        playground_id: playgroundId,
      }
    });

    if (!association) {
      return res.status(404).json({ error: 'Association not found' });
    }

    await association.destroy();

    res.status(200).json({ message: 'Playground removed from folder successfully' });
  } catch (error) {
    console.error('Error removing playground from folder:', error);
    res.status(500).json({ error: 'Failed to remove playground from folder' });
  }
});

module.exports = router;
