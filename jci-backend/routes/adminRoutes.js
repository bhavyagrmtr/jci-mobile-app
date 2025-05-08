const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all pending users
router.get('/pending-users', async (req, res) => {
    try {
        const users = await User.find({ status: 'pending' });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
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