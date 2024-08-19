import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import PlaygroundPage from './components/PlaygroundPage';
import './styles.css';


const App = () => {
  const [token, setToken] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/home" element={token ? <Home /> : <Login setToken={setToken} />} />
        <Route path="/playgrounds" element={token ? <PlaygroundPage /> : <Login setToken={setToken} />} /> {/* PlaygroundPage route */}
        <Route path="/" element={
          token ? (
            <div>
              <h1>Welcome to TravelTots PlaySpots</h1>
              <p>
                <Link to="/Home">Login to Find Playgrounds Near You</Link>
              </p>
            </div>
          ) : (
            <Login setToken={setToken} />
          )
        } 
        />
      </Routes>
    </Router>
  );
};

export default App;
