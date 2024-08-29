// components/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles.css';
import Navbar from './Navbar';

const Home = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [travelTime, setTravelTime] = useState(10);
  const [playgrounds, setPlaygrounds] = useState([]);
  const [folders, setFolders] = useState([]); // State to hold folders
  const [selectedFolder, setSelectedFolder] = useState(''); // State for selected folder

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error('Error fetching geolocation:', error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert('Permission to access location was denied. Please enable location services to use this feature.');
              break;
            case error.POSITION_UNAVAILABLE:
              alert('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              alert('The request to get your location timed out. Please try again.');
              break;
            case error.UNKNOWN_ERROR:
              alert('An unknown error occurred while trying to fetch your location.');
              break;
            default:
              alert('An error occurred while trying to fetch your location.');
          }
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      alert('Geolocation is not supported by your browser. Please use a different browser or device to use this feature.');
    }
  }, []);

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId) {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      axios.get(`https://traveltotsbackend.onrender.com/api/folders/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setFolders(response.data || []);
      })
      .catch(error => {
        console.error('Error fetching folders:', error);
      });
    }
  }, []);

  const fetchPlaygrounds = async () => {
    try {
      console.log('Fetching playgrounds...');
      let allPlaygrounds = [];
      let hasMore = true;
      let pageToken = '';
  
      while (hasMore) {
        const response = await axios.post('https://traveltotsbackend.onrender.com/api/playgrounds', {
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

  const handleSavePlayground = (playground) => {
    console.log('Playground:', playground);
    console.log('Selected Folder:', selectedFolder);
  
    if (!playground) {
      console.error('Playground object is undefined');
      return;
    }
    if (!selectedFolder) {
      alert('Please select a folder to save the playground.');
      return;
    }

    const token = localStorage.getItem('token'); // Get the token from localStorage
    axios.post('https://traveltotsbackend.onrender.com/api/playgrounds/save', { 
      folderId: selectedFolder, 
      playground: playground  // Send the entire playground object
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      alert('Playground saved successfully!');
    })
    .catch(error => {
      console.error('Error saving playground:', error);
    });
  };

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = parseJwt(token);
      return decodedToken ? decodedToken.id : null; // Use 'id' instead of 'userId'
    }
    return null;
  };
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
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
      
      <div className="saved-playgrounds">
        <ul className="list-group">
          {playgrounds.map((pg, index) => {
            console.log('Playground object:', pg); // Log the entire pg object
            return (
              <li key={index} className="list-group-item">
                <h5>{pg.name}</h5>
                <p>{pg.travelTime} minutes away - <a href={pg.mapsLink} target="_blank" rel="noopener noreferrer">{pg.address} Open in Google Maps!</a></p>
                <button onClick={() => handleSavePlayground(pg)} className="btn btn-secondary">Save to Folder</button> {/* Save button */}
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                >
                  <option value="">Select a folder</option>
                  {folders.map(folder => (
                    <option key={folder.id} value={folder.id}>{folder.name}</option>
                  ))}
                </select>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Home;
