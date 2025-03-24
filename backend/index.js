const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Connect to MongoDB
mongoose.connect('mongodb+srv://mkumar0607200:mkumar067200@cluster0.kjoor.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB: ', err));

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Define Phone Number Schema
const phoneSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  whatsappLink: { type: String, required: true },
});

const Phone = mongoose.model('Phone', phoneSchema);

// Define User Schema for Login (This is no longer needed but kept for reference)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Middleware to protect routes
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); 
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, 'yourSecretKey'); 
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).send('Invalid token');
  }
};

// POST endpoint for user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Hardcoded username and password
  const validUsername = 'mk@gmail.com';
  const validPassword = '123456789';

  if (username !== validUsername || password !== validPassword) {
    return res.status(400).send('Invalid username or password');
  }

  try {
    const token = jwt.sign({ username: validUsername }, 'yourSecretKey', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).send('Error during login');
  }
});

// POST endpoint to save or replace phone number and WhatsApp link
app.post('/save-phone', authenticate, async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).send('Phone number is required');
  }

  const whatsappLink = `https://wa.me/${phoneNumber}`;
  try {
    await Phone.deleteMany({}); // Clear any existing data
    const phone = new Phone({ phoneNumber, whatsappLink });
    await phone.save();

    res.status(200).send({
      message: 'Phone number and WhatsApp link saved successfully!',
      data: phone
    });
  } catch (error) {
    res.status(500).send('Error saving phone number and WhatsApp link');
  }
});

// GET endpoint to fetch all phone numbers
app.get('/get-phones', authenticate, async (req, res) => {
  try {
    const phones = await Phone.find();
    res.status(200).json(phones);
  } catch (error) {
    res.status(500).send('Error fetching phone numbers');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
