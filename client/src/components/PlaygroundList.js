import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlaygroundList = ({ playgrounds }) => {
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);

    useEffect(() => {
        // Fetch folders for dropdown
        axios.get('/api/folders/:userId')  // Replace with actual user ID
            .then(response => {
                setFolders(response.data);
            })
            .catch(error => {
                console.error('Error fetching folders:', error);
            });
    }, []);

    const handleSave = (playground) => {
        if (selectedFolder) {
            axios.post('/api/playgrounds/save', {
                folderId: selectedFolder,
                playground
            }).then(response => {
                alert('Playground saved successfully!');
            }).catch(error => {
                console.error('Error saving playground:', error);
            });
        } else {
            alert('Please select a folder first!');
        }
    };

    return (
        <ul className="list-group">
            {playgrounds.map(playground => (
                <li key={playground.place_id} className="list-group-item">
                    <h5>{playground.name}</h5>
                    <p>Travel Time: {playground.travelTime} minutes</p>
                    <a href={playground.mapsLink} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
                    <select onChange={(e) => setSelectedFolder(e.target.value)}>
                        <option value="">Select Folder</option>
                        {folders.map(folder => (
                            <option key={folder.id} value={folder.id}>{folder.name}</option>
                        ))}
                    </select>
                    <button onClick={() => handleSave(playground)}>Save</button>
                </li>
            ))}
        </ul>
    );
};

export default PlaygroundList;
