import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LoginPage = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage('Please enter both username and password');
      return;
    }

    try {
      const response = await axios.post('https://backend-exchange.vercel.app/login', { username, password });

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setIsLoggedIn(true);
        setMessage('Login successful');
      } else {
        setMessage('Invalid username or password');
      }
    } catch (error) {
      setMessage('Error during login');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-semibold text-center mb-6 text-blue-600">Login</h1>
        <form onSubmit={handleLoginSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-lg"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-lg"
            />
          </div>
          <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-md text-lg">
            Login
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
