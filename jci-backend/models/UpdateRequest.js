const mongoose = require('mongoose');

const updateRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  field: {
    type: String,
    required: true,
    enum: ['fullName', 'occupation', 'mobileNumber', 'location', 'profilePicture']
  },
  newValue: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'image'],
    default: 'text'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UpdateRequest', updateRequestSchema);