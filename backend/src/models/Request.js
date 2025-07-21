const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestType: {
    type: String,
    enum: ['buy', 'rent', 'lease', 'let'],
    required: true
  },
  preferredLocation: String,
  budget: Number,
  notes: String,
  isFulfilled: {
    type: Boolean,
    default: false
  },
  dateRequested: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
