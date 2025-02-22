const express = require('express');
const router = express.Router();
const { 
    createBooking, 
    getBooking,
    getAllBookings, 
    updateBookingStatus, 
    generateInvoice 
} = require('../controllers/bookingController');

// Routes for bookings
router.post('/createBooking', createBooking); 
// Create a new booking
router.get('/getAllBookings', getAllBookings);  // Get all bookings
// Get a user by ID
router.get('/getBooking/:id', getBooking);

// Update booking status and GST status
router.put('/updateBookingStatus/:bookingId', updateBookingStatus); // Update booking status

// Generate invoice for a specific booking
router.get('/generateInvoice/:bookingId/invoice', generateInvoice);  // Generate invoice for a specific booking

module.exports = router;
