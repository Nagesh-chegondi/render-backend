const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const app = express();

// ✅ Use environment variable for secret
const JWT_SECRET = "ILOVESAMYUKTHA"

// ✅ Port from Render/Heroku/etc.
const port = 5000

// ✅ Import models
const { userModel, todoModel } = require('./db');

// ✅ MongoDB connection string from env
mongoose.connect("mongodb+srv://kantamani6227:PYDptQe9bILURACg@cluster0.6eug4oy.mongodb.net/blogiese")
app.use(express.json());
app.use(cors());

// Signup
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || email.trim() === '' || password.trim() === '') {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const existingUser = await userModel.findOne({ email });
  if (!existingUser) {
    await userModel.create({ email, password });
    return res.status(201).json({ message: "User signed up successfully" });
  } else {
    return res.status(401).json({ message: "User already exists" });
  }
});

// Signin
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || email.trim() === '' || password.trim() === '') {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await userModel.findOne({ email, password });
  if (user) {
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    return res.status(200).json({ message: 'User signed in', token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Fetch todos
app.get('/me', async (req, res) => {
  let token = req.headers.token;
  if (!token) return res.status(401).json({ message: "Please sign in" });

  try {
    let decoded = jwt.verify(token, JWT_SECRET);
    const todos = await todoModel.find({ userId: decoded.id });
    return res.status(200).json({ todos });
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
});

// Add todo
app.post('/adtodo', async (req, res) => {
  let token = req.headers.token;
  let { todo } = req.body;

  if (!token) return res.status(401).json({ message: "Please sign in" });

  let decoded = jwt.verify(token, JWT_SECRET);
  await todoModel.create({ titles: todo, status: false, userId: decoded.id });

  return res.status(201).json({ message: "Todo added successfully" });
});

// Delete todo
app.delete('/delete', async (req, res) => {
  let token = req.headers.token;
  let { todo } = req.body;

  if (!token) return res.status(401).json({ message: "Please sign in" });

  let decoded = jwt.verify(token, JWT_SECRET);
  await todoModel.deleteOne({ titles: todo, userId: decoded.id });

  return res.status(200).json({ message: "Todo deleted successfully" });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}/`);
});
