const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Image = require('../models/Image');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Upload new image
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const image = new Image({
            imageUrl: req.file.path,
            uploadedBy: req.body.adminId
        });

        await image.save();
        res.status(201).json({ message: 'Image uploaded successfully', image });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all images
router.get('/', async (req, res) => {
    try {
        const images = await Image.find().sort({ uploadedAt: -1 });
        res.json(images);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 