import React, { useState } from 'react';
import '../styles.css'; // Ensure your CSS file is imported
import axios from 'axios';

const CreateFolder = ({ onFolderCreated, onFolderDeleted }) => {
  const [folderName, setFolderName] = useState('');

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

  const handleCreateFolder = () => {
    const userId = getUserIdFromToken();
    const token = localStorage.getItem('token'); // Get the token from localStorage

    axios.post('http://localhost:5000/api/folders', { userId, name: folderName }, {
      headers: {
        Authorization: `Bearer ${token}` // Include the token in the request headers
      }
    })
    .then(response => {
      alert('New folder created successfully!');
      onFolderCreated(response.data); // Notify parent component
      setFolderName(''); // Clear the input after creation
    })
    .catch(error => {
      console.error('Error creating folder:', error);
      alert('Failed to create folder.');
    });
  };

  const handleDeleteFolder = (folderId) => {
    const token = localStorage.getItem('token'); // Get the token from localStorage

    axios.delete(`http://localhost:5000/api/folders/${folderId}`, {
      headers: {
        Authorization: `Bearer ${token}` // Include the token in the request headers
      }
    })
    .then(response => {
      alert('Folder deleted successfully!');
      onFolderDeleted(folderId); // Notify parent component
    })
    .catch(error => {
      console.error('Error deleting folder:', error);
      alert('Failed to delete folder.');
    });
  };

  return (
    <div>
      <input 
        type="text" 
        value={folderName} 
        onChange={(e) => setFolderName(e.target.value)} 
        placeholder="Folder Name" 
      />
      <button onClick={handleCreateFolder} className="btn-create-folder">Create Folder</button>
    </div>
  );
};

export default CreateFolder;
