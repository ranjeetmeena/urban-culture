const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  gstAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  gstStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
}, 
{
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
