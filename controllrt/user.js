// routes/user.js
const express = require('express');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const authenticateUser = require('../mid/auth_mid');

const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
  try {
    const { username, email, password , userType} = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User with this email already exists.' });
    }

    const newUser = new User({
      username,
      email,
      password,
      userType: userType || 'user', // Default to 'user' if not provided
    });

    await newUser.save();
    const token = newUser.generateAuthToken();

    res.json({ token,newUser, msg: 'User registered successfully.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

userRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found.' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: 'Invalid password.' });
    }

    const additionalInfo = {
        userId: user._id,
        username: user.username,
        email: user.email,
        userType:user.userType
        // Add more properties as needed
      };
  
    const token = user.generateAuthToken();
    res.json({ token, additionalInfo, msg: 'Login successful.'});
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

userRouter.get("/profile", authenticateUser, async (req, res) => {
    try {
      const orders = await User.findOne({ userId: req.user });
      res.json(orders);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

module.exports = userRouter;
