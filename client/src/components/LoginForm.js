import React, { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Email:
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
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
  );
}

export default LoginForm;
