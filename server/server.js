require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const shoppingListRoutes = require('./routes/shoppingList');

const app = express();

// In production, we don't need a prefix since we're using a subdomain
const API_PREFIX = '';


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/shopping-lists', shoppingListRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nachoaveragecart';

// Log connection string (without credentials) for debugging
const sanitizedUri = MONGODB_URI.replace(
  /mongodb(\+srv)?:\/\/([^:]+:[^@]+@)?([^\/]+)(.*)/,
  (_, srv, auth, host) => `mongodb${srv || ''}://${auth ? '***:***@' : ''}${host}/***`
);
console.log(`Attempting to connect to MongoDB at ${sanitizedUri}`);

// Connect with options suitable for production
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Please ensure you have set the correct MONGODB_URI environment variable');
    console.log('For Render deployment, you should use a MongoDB Atlas connection string');
  });

// Only start the server if this file is run directly (not imported by lambda.js)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app for AWS Lambda
module.exports = app;
