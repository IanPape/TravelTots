import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css'; // Import your CSS file

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="navbar-brand">
        <Link to="/home">
          <img src="/icon.jpg.webp" alt="TravelTots Logo" className="navbar-logo" />
          TravelTots PlaySpots!
        </Link>
      </div>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link-custom" to="/saved-playgrounds">Saved Playgrounds</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
