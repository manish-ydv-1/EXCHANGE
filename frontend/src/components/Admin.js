import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [phones, setPhones] = useState([]);

  const fetchPhones = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('https://backend-exchange.vercel.app/get-phones', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPhones(response.data);
    } catch (error) {
      setMessage('Error fetching phone numbers');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber) {
      setMessage('Please enter a phone number');
      return;
    }

    const whatsappLink = `https://wa.me/${phoneNumber}`;

    try {
      const token = localStorage.getItem('authToken');
      await axios.post('https://backend-exchange.vercel.app/save-phone', { phoneNumber, whatsappLink }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Phone number and WhatsApp link saved successfully!');
      setPhoneNumber('');
      fetchPhones();
    } catch (error) {
      setMessage('Error saving phone number');
    }
  };

  useEffect(() => {
    fetchPhones();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-semibold text-center mb-6 text-blue-600">Admin Dashboard</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-lg"
            />
          </div>
          <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-md text-lg">
            Save Phone
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
        <h2 className="mt-6 text-lg font-semibold text-center">Saved Phone Numbers</h2>
        <ul className="mt-4">
          {phones.map((phone) => (
            <li key={phone._id} className="p-2 border-b border-gray-300">
              {phone.phoneNumber} - <a href={phone.whatsappLink} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Admin;
