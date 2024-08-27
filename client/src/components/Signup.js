import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';



const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://traveltotsbackend.onrender.com/api/register', { username, email, password });
      console.log('Registration successful:', response.data); // Debugging line
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="register">
    <form onSubmit={handleSubmit}>
        <img src="/logo.jpg.webp" alt="TravelTots Logo" className="login-image" /> 
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Register</button>
    </form>
    </div>
  );
};

export default Signup;
