const User = require('../models/userModel');
const Joi = require('joi');

// Create a new user
const createUser = async (req, res) => {

  try {
    let userData = req.body;
    let validator = Joi.object({
      name: Joi.string().required().messages({ "*": `name is required` }),
      email: Joi.string().email().required().messages({ "*": `email is required` }),
      age: Joi.string().required().messages({ "*": `age is required` }),
      phone: Joi.string().required().messages({ "*": `phone is required` })

    });

    let { error } = validator.validate(userData);
    if (error) {
      return res.status(400).json({
        message: error.message
      });
    }
    let getUser = await User.findOne({ name: userData.name });
    if (getUser) {
      return res.status(400).json({
        message: "User aleady exist."
      });
    } else {

      const newUser = new User({
        name: userData.name,
        email: userData.email,
        age: userData.age,
        phone: userData.phone
      });
      await newUser.save();

      return res.status(200).json({
        message: 'User data added successfully.',
        // data : newUser
      });
    }
  } catch (error) {
    console.log('dfsdfsdaf', error);
    return res.status(500).json({
      message: "Server error"
    })
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users) {
      return res.status(200).json({
        message: 'User data get all successfully.',
        data : users
      });
    } else {
      return res.status(400).json({
        message: 'User data not found.'
      });
    }

  } catch (error) {
    console.log('dfsdfsdaf', error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

// Get a single user by ID
const getUser = async (req, res) => {
  try {
    const user = await User.findOne({_id:req.params.id});
    if (!user) {
      return res.status(400).json({
        message: 'User data not found.'
      });

    } else {
      return res.status(200).json({
        message: 'User data get successfully.',
        data: user
      });
    }
  } catch (error) {
    console.log('dfsdfsdaf', error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    let userData = req.body;
    // console.log('userData', userData);
    let validator = Joi.object({
      name: Joi.string().required().messages({ "*": `name is required` }),
      email: Joi.string().email().required().messages({ "*": `email is required` }),
      age: Joi.string().required().messages({ "*": `age is required` }),
      phone: Joi.string().required().messages({ "*": `phone is required` })

    });

    let { error } = validator.validate(userData);
    if (error) {
      return res.status(400).json({
        message: error.message
      });
    }

    let updatedUser = await User.updateOne(
      {
          _id: req.params.id,
      },
      {
          $set: {
              name: userData.name,
              email: userData.email,
              age: userData.age,
              phone: userData.phone,
          },
      },
      { upsert: true }
  );

    if (!updatedUser) {
      return res.status(400).json({
        message: 'User data not found.'
      });
    }else{
      const updatedUser = await User.findOne({_id:req.params.id});
      return res.status(200).json({
        message: 'User data updated successfully.',
        data : updatedUser
      });
    }
  } catch (error) {
    console.log('dfsdfsdaf', error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(400).json({
        message: 'User data not found.'
      });
    } else {
      return res.status(200).json({
        message: 'User data delete successfully.'
      });
    }

  } catch (error) {
    console.log('dfsdfsdaf', error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = { createUser, getUsers, getUser, updateUser, deleteUser };
