const express = require('express');
const router = express.Router();
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userControllers');

// Create a new user
router.post('/createUser', createUser);

// Get all users
router.get('/getAllUsers', getUsers);

// Get a user by ID
router.get('/getUser/:id', getUser);

// Update a user by ID
router.put('/updateUser/:id', updateUser);

// Delete a user by ID
router.delete('/deleteUser/:id', deleteUser);

module.exports = router;
