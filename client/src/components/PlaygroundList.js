import React from 'react';

const PlaygroundList = ({ playgrounds }) => (
  <ul className="list-group">
    {playgrounds.map((playground) => (
      <li key={playground.place_id} className="list-group-item">
        <h5>{playground.name}</h5>
        <p>Travel Time: {playground.travelTime} minutes</p>
        {/* Ensure that anchor tag has explicit text */}
        <a
          href={playground.mapsLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="map-link" // Optional: Add a class for styling if needed
        >
          Open in Google Maps
        </a>
      </li>
    ))}
  </ul>
);

export default PlaygroundList;
