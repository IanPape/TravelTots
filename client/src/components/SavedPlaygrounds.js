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

    const token = localStorage.getItem('token'); // Get the token from localStorage
    axios.get(`https://traveltotsbackend.onrender.com/api/folders/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
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

  const handleFolderDeleted = (folderId) => {
    const token = localStorage.getItem('token'); // Get the token from localStorage
  
    axios.delete(`https://traveltotsbackend.onrender.com/api/folders/${folderId}`, {
      headers: {
        Authorization: `Bearer ${token}` // Include the token in the request headers
      }
    })
    .then(response => {
      alert('Folder deleted successfully!');
      setFolders(folders.filter(folder => folder.id !== folderId));
    })
    .catch(error => {
      console.error('Error deleting folder:', error);
      alert('Failed to delete folder.');
    });
  };
  const handlePlaygroundDeleted = (folderId, playgroundId) => {
    const token = localStorage.getItem('token'); // Get the token from localStorage
  
    axios.delete(`https://traveltotsbackend.onrender.com/api/folders/${folderId}/playgrounds/${playgroundId}`, {
      headers: {
        Authorization: `Bearer ${token}` // Include the token in the request headers
      }
    })
    .then(response => {
      alert('Playground removed successfully!');
      setFolders(folders.map(folder => 
        folder.id === folderId 
          ? { ...folder, playgrounds: folder.playgrounds.filter(pg => pg.id !== playgroundId) } 
          : folder
      ));
    })
    .catch(error => {
      console.error('Error removing playground:', error);
      alert('Failed to remove playground.');
    });
  };
  

  return (
    <div className="saved-playgrounds">
      <h1>Saved Playgrounds</h1>
      <CreateFolder onFolderCreated={handleFolderCreated} />
      {folders.length > 0 ? (
        folders.map((folder) => (
          <div key={folder.id} className="folder-container">
            <div className="folder-header">
              <h2 className="folder-name">{folder.name}</h2>
              <button onClick={() => handleFolderDeleted(folder.id)} className="btn-delete-folder">Delete Folder</button>
            </div>
            {/* Display the playgrounds in the folder */}
            <ul>
              {folder.playgrounds && folder.playgrounds.length > 0 ? (
                folder.playgrounds.map((playground) => (
                  <li key={playground.id} className="playground-item">
                    <a href={playground.map_link} target="_blank" rel="noopener noreferrer">
                      {playground.name}
                    </a>
                    <button 
                      onClick={() => handlePlaygroundDeleted(folder.id, playground.id)} 
                      className="btn-delete-playground"
                    >
                      x
                    </button>
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
