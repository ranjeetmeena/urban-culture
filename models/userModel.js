const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  age: { type: Number },
  phone :{ type:String} 

},
{
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

const User = mongoose.model('User', userSchema);

module.exports = User;
