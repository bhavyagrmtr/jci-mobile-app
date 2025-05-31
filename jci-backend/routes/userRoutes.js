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
        console.log('Fetching approved users with profile pictures...');
        
        const users = await User.find({ 
            status: 'approved',
            profilePicture: { $ne: '' } // Only get users with profile pictures
        }).select('fullName occupation location profilePicture dateOfBirth'); // Select only necessary fields

        console.log(`Found ${users.length} approved users with profile pictures`);

        // Transform the data to include full profile picture URLs
        const usersWithUrls = users.map(user => {
            const userObj = user.toObject();
            // Ensure the profile picture path is properly formatted
            if (userObj.profilePicture) {
                // Remove any leading slashes to prevent double slashes in URL
                const cleanPath = userObj.profilePicture.replace(/^\/+/, '');
                userObj.profilePicture = `${req.protocol}://${req.get('host')}/${cleanPath}`;
            }
            return userObj;
        });

        console.log('Successfully processed user data');

        res.json({
            success: true,
            data: usersWithUrls
        });
    } catch (error) {
        console.error('Error fetching approved users:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching approved users',
            error: error.message 
        });
    }
});

// Update user profile picture
router.post('/:id/profile-picture', upload.single('profilePicture'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                message: 'No image file provided' 
            });
        }

        console.log('Uploaded file:', req.file);

        // Create full URL for the uploaded image
        const cleanPath = req.file.path.replace(/^\/+/, '');
        const imageUrl = `${req.protocol}://${req.get('host')}/${cleanPath}`;

        // Update user's profile picture
        user.profilePicture = req.file.path;
        await user.save();

        console.log('Profile picture updated successfully:', imageUrl);

        res.json({ 
            success: true,
            message: 'Profile picture uploaded successfully',
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error uploading profile picture',
            error: error.message 
        });
    }
});

// Request update
router.post('/request-update', async (req, res) => {
    try {
        const { userId, field, newValue, type } = req.body;
        console.log('Received update request:', { userId, field, type });
        console.log('Request body:', req.body);

        // Validate user exists
        const user = await User.findById(userId);
        console.log('Found user:', user ? 'Yes' : 'No');
        
        if (!user) {
            console.error('User not found with ID:', userId);
            return res.status(404).json({ 
                success: false, 
                message: 'User not found',
                details: { userId }
            });
        }

        // Create update request
        const updateRequest = new UpdateRequest({
            userId,
            field,
            newValue,
            type,
            status: 'pending'
        });

        await updateRequest.save();
        console.log('Update request saved successfully');

        res.json({ 
            success: true, 
            message: 'Update request sent successfully',
            request: updateRequest
        });
    } catch (error) {
        console.error('Error in request-update:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message,
            details: error.stack
        });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { mobileNumber, password } = req.body;
        console.log('Login request received:', req.body);
        
        if (!mobileNumber || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Mobile number and password are required' 
            });
        }

        const user = await User.findOne({ mobileNumber });
        console.log('User found:', user);

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Verify password
        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid password' 
            });
        }

        // Create full profile picture URL if it exists
        let profilePictureUrl = '';
        if (user.profilePicture) {
            const cleanPath = user.profilePicture.split('\\')[1];
            profilePictureUrl = `${req.protocol}://${req.get('host')}/uploads/${cleanPath}`;
        }

        if (user.status === 'approved') {
            res.json({ 
                success: true,
                status: 'approved',
                user: {
                    _id: user._id,
                    fullName: user.fullName,
                    mobileNumber: user.mobileNumber,
                    occupation: user.occupation,
                    location: user.location,
                    dateOfBirth: user.dateOfBirth,
                    profilePicture: profilePictureUrl
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