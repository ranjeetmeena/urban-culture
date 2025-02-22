const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routers/userRouters');
const bookingRoutes = require('./routers/bookingRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // for parsing JSON bodies


// Routes
app.use('/api/users', userRoutes);
app.use('/api/booking', bookingRoutes);

// Connect to MongoDB
connectDB();



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
