import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';



const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook to handle navigation

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const trimmedPassword = password.trim();
      console.log('Attempting login with:', { username, trimmedPassword });

      const response = await axios.post('http://localhost:5000/api/login', { username, password: trimmedPassword });

      console.log('Login successful:', response.data);

      setToken(response.data.token);

      // Redirect to homepage after successful login
      navigate('/home');
    } catch (error) {
      if (error.response) {
        console.error('Login failed:', error.response.data);
      } else {
        console.error('Login failed:', error.message);
      }
    }
  };

  return (
    <div className="login">
      <img src="/logo.jpg.webp" alt="TravelTots Logo" className="login-image" /> 
      <form onSubmit={handleSubmit}>
        <label>Username:
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </label>
        <label>Password:
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </label>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Register here</Link></p>
    </div>
  );
};

export default Login;
