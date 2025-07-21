const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['sale', 'rent', 'hostel', 'lease'],
    required: true
  },
  category: {
    type: String,
    enum: ['house', 'apartment', 'land', 'hostel'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  images: [String],
  isAvailable: {
    type: Boolean,
    default: true
  },
  listedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  dateListed: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
