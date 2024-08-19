import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';


const Home = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [travelTime, setTravelTime] = useState(10); // Default to 10 minutes
  const [playgrounds, setPlaygrounds] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error('Error fetching geolocation:', error);
        }
      );
    }
  }, []);

  const fetchPlaygrounds = async () => {
    try {
      console.log('Fetching playgrounds...');
      let allPlaygrounds = [];
      let hasMore = true;
      let pageToken = '';
  
      while (hasMore) {
        const response = await axios.post('http://localhost:5000/api/playgrounds', {
          latitude,
          longitude,
          travelTime,
          pageToken
        });
  
        console.log('Response data:', response.data);
  
        allPlaygrounds = [...allPlaygrounds, ...response.data];
  
        pageToken = response.data.next_page_token || '';
        hasMore = !!pageToken;
      }
  
      console.log('Playgrounds fetched:', allPlaygrounds);
      setPlaygrounds(allPlaygrounds);
    } catch (error) {
      console.error('Error fetching playgrounds:', error);
    }
  };

  return (
    <div className="container">
      <h1>Find Play Spots!</h1>
      <form 
        className="mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          fetchPlaygrounds();
        }}>
        <div className="row mb-3">
          <label htmlFor="travelTime" className="col-sm-2 col-form-label">
            Travel Time:
          </label>
          <div className="col-sm-10">
            <select
              id="travelTime"
              className="form-select"
              value={travelTime}
              onChange={(e) => setTravelTime(e.target.value)}
            >
              {[10, 15, 20, 25, 30].map(time => (
                <option key={time} value={time}>{time} minutes</option>
              ))}
            </select>
          </div>
        </div>
        <img src="/icon.jpg.webp" alt="TravelTots Logo" className="icon-image" /> 
        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Find Play Spots!
          </button>
        </div>
      </form>
      <ul className="list-group">
        {playgrounds.map((pg, index) => (
          <li key={index} className="list-group-item">
            <h5>{pg.name}</h5>
            <p>{pg.travelTime} minutes away - <a href={pg.mapsLink} target="_blank" rel="noopener noreferrer">{pg.address} Open in Google Maps!</a></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
