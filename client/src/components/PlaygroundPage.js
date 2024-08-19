import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PlaygroundList from './PlaygroundList'; 

const PlaygroundPage = () => {
  const [playgrounds, setPlaygrounds] = useState([]);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      axios.post('http://localhost:5000/playgrounds', {
        latitude: location.latitude,
        longitude: location.longitude,
        travelTime: '30'
      })
      .then(response => {
        console.log('Received playgrounds:', response.data); // Log the received data
        setPlaygrounds(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the playgrounds!', error);
      });
    }
  }, [location]);

  return (
    <div>
      <PlaygroundList playgrounds={playgrounds} /> {/* Render the PlaygroundList with the data */}
    </div>
  );
};

export default PlaygroundPage;
