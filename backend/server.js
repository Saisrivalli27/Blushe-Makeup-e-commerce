require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'BLUSHÉ API is running' });
});

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/debug', require('./routes/debugRoutes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
