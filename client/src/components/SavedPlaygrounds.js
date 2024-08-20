import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateFolder from './CreateFolder';
import '../styles.css'; // Ensure your CSS file is imported

const SavedPlaygrounds = () => {
  const [folders, setFolders] = useState([]);

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

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = parseJwt(token);
      return decodedToken ? decodedToken.userId : null;
    }
    return null;
  };

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    axios.get(`http://localhost:5000/api/folders/${userId}`)
      .then(response => {
        setFolders(response.data || []);  // Ensure folders is always an array
      })
      .catch(error => {
        console.error('Error fetching saved playgrounds:', error);
        setFolders([]);  // Set an empty array if there's an error
      });
  }, []);

  const handleFolderCreated = (newFolder) => {
    setFolders((prevFolders) => [...prevFolders, newFolder]);
  };

  return (
    <div className="saved-playgrounds">
      <h1>Saved Playgrounds</h1>
      <CreateFolder onFolderCreated={handleFolderCreated} /> {/* The existing working button */}
      {folders.length > 0 ? (
        folders.map((folder) => (
          <div key={folder.id}>
            <h2>{folder.name}</h2>
            {/* Display the playgrounds in the folder */}
            <ul>
              {folder.playgrounds && folder.playgrounds.length > 0 ? (
                folder.playgrounds.map((playground) => (
                  <li key={playground.id}>
                    <a href={playground.map_link} target="_blank" rel="noopener noreferrer">
                      {playground.name}
                    </a>
                  </li>
                ))
              ) : (
                <li>No playgrounds saved in this folder.</li>
              )}
            </ul>
          </div>
        ))
      ) : (
        <p>No folders found.</p>
      )}
    </div>
  );
};

export default SavedPlaygrounds;
