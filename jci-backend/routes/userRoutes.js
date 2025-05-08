const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const UpdateRequest = require('../models/UpdateRequest');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

// Register new user
router.post('/register', upload.single('profilePicture'), async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        console.log('Uploaded file:', req.file);

        // Validate required fields
        const requiredFields = ['fullName', 'occupation', 'mobileNumber', 'dateOfBirth', 'location', 'password'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            console.log('Missing fields:', missingFields);
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ mobileNumber: req.body.mobileNumber });
        if (existingUser) {
            console.log('User already exists with mobile number:', req.body.mobileNumber);
            return res.status(400).json({
                success: false,
                message: 'User with this mobile number already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const user = new User({
            fullName: req.body.fullName,
            occupation: req.body.occupation,
            mobileNumber: req.body.mobileNumber,
            dateOfBirth: new Date(req.body.dateOfBirth),
            location: req.body.location,
            password: hashedPassword,
            profilePicture: req.file ? req.file.path : '',
            status: 'pending'
        });

        console.log('Saving new user:', {
            fullName: user.fullName,
            mobileNumber: user.mobileNumber,
            location: user.location,
            hasProfilePicture: !!user.profilePicture
        });

        // Save user to database
        await user.save();
        console.log('User saved successfully');

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please wait for admin approval.',
            data: {
                id: user._id,
                fullName: user.fullName,
                mobileNumber: user.mobileNumber,
                status: user.status
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            console.log('Validation errors:', messages);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            console.log('Duplicate key error:', error);
            return res.status(400).json({
                success: false,
                message: 'Mobile number already exists'
            });
        }

        // Handle file upload errors
        if (error.name === 'MulterError') {
            console.log('File upload error:', error);
            return res.status(400).json({
                success: false,
                message: 'Error uploading profile picture. Please try again.'
            });
        }

        console.error('Unexpected error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in registration. Please try again.'
        });
    }
});

// Get all approved users
router.get('/approved', async (req, res) => {
    try {
        const users = await User.find({ status: 'approved' });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user profile picture
router.put('/:id/profile-picture', upload.single('profilePicture'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.profilePicture = req.file.path;
        await user.save();
        res.json({ message: 'Profile picture updated successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Request profile update
router.post('/request-update', async (req, res) => {
  try {
    const { userId, field, newValue } = req.body;
    const updateRequest = new UpdateRequest({
      userId,
      field,
      newValue
    });
    await updateRequest.save();
    res.status(201).json({ message: 'Update request submitted successfully', updateRequest });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { mobileNumber, password } = req.body;
        
        if (!mobileNumber || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Mobile number and password are required' 
            });
        }

        const user = await User.findOne({ mobileNumber });

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Verify password
        if (user.password !== password) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid password' 
            });
        }

        if (user.status === 'approved') {
            res.json({ 
                success: true,
                status: 'approved',
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    mobileNumber: user.mobileNumber,
                    occupation: user.occupation,
                    location: user.location,
                    dateOfBirth: user.dateOfBirth,
                    profilePicture: user.profilePicture
                }
            });
        } else if (user.status === 'pending') {
            res.status(401).json({ 
                success: false,
                status: 'pending',
                message: 'Your account is pending approval'
            });
        } else {
            res.status(401).json({ 
                success: false,
                status: 'rejected',
                message: 'Your account has been rejected'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
});

module.exports = router; 