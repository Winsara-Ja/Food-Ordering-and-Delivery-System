import React, { useState } from 'react';
import axios from 'axios';


export const DriverLogin = () => {
  const [driverID, setDriverID] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      driverID,
      password,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/drivers/login', loginData);

      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token);

        window.location.href = '/online'; 
      }
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.message : 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Sign in to your account</h2>

        {/* Display error message if exists */}
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="driverID" className="block text-sm font-medium text-gray-700">Driver ID</label>
            <input
              type="text"
              id="driverID"
              name="driverID"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={driverID}
              onChange={(e) => setDriverID(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Sign in
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm">Forgot password? <a href="/forgot-password" className="text-blue-500">Click here</a></p>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm">Not a member? <a href="/register" className="text-blue-500">Start a 14-day free trial</a></p>
        </div>
      </div>
    </div>
  );
};
