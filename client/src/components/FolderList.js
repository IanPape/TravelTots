import React, { useState, useEffect } from 'react';
import CreateFolder from './CreateFolder';
import axios from 'axios';

const FolderList = () => {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const userId = /* logic to get user ID */;
    axios.get(`http://localhost:5000/api/folders/${userId}`)
      .then(response => setFolders(response.data))
      .catch(error => console.error('Error fetching folders:', error));
  }, []);

  const handleFolderCreated = (newFolder) => {
    setFolders([...folders, newFolder]);
  };

  const handleFolderDeleted = (folderId) => {
    setFolders(folders.filter(folder => folder.id !== folderId));
  };

  return (
    <div>
      <CreateFolder onFolderCreated={handleFolderCreated} onFolderDeleted={handleFolderDeleted} />
      <ul>
        {folders.map(folder => (
          <li key={folder.id}>
            {folder.name}
            <button onClick={() => handleFolderDeleted(folder.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FolderList;
