const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UpdateRequest = require('../models/UpdateRequest');

// Get all users
router.get('/all-users', async (req, res) => {
    try {
        const users = await User.find()
            .select('fullName email mobileNumber profilePicture status occupation location dateOfBirth')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get total users count
router.get('/total-users', async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all pending users
router.get('/pending-users', async (req, res) => {
    try {
        const users = await User.find({ status: 'pending' })
            .select('fullName email mobileNumber profilePicture status occupation location dateOfBirth');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all update requests
router.get('/update-requests', async (req, res) => {
    try {
        const requests = await UpdateRequest.find({ status: 'pending' })
            .populate('userId', 'fullName email mobileNumber profilePicture');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Approve update request
router.put('/approve-update/:id', async (req, res) => {
    try {
        const request = await UpdateRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Update request not found' });
        }

        const user = await User.findById(request.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user field
        user[request.field] = request.newValue;
        await user.save();

        // Update request status
        request.status = 'approved';
        request.updatedAt = new Date();
        await request.save();

        res.json({ message: 'Update request approved successfully', request });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Reject update request
router.put('/reject-update/:id', async (req, res) => {
    try {
        const request = await UpdateRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Update request not found' });
        }

        request.status = 'rejected';
        request.updatedAt = new Date();
        await request.save();

        res.json({ message: 'Update request rejected successfully', request });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Approve user
router.put('/approve-user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.status = 'approved';
        await user.save();
        res.json({ message: 'User approved successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Reject user
router.put('/reject-user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.status = 'rejected';
        await user.save();
        res.json({ message: 'User rejected successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Admin login (HARD-CODED for development only)
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Hardcoded credentials
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'secret123';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Success
        return res.json({ success: true, message: 'Admin login successful' });
    } else {
        // Failure
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Simulate notification for new user registration
router.post('/notify-new-user', async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // In a real app, send push notification or in-app alert here
        console.log(`New user registered: ${user.fullName}`);
        res.json({ message: 'Notification sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 