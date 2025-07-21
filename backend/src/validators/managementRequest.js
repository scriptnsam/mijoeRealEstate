const Joi = require('joi');
const mongoose = require('mongoose');

const isValidObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message('Invalid property ID');
  }
  return value;
};

const createManagementRequestSchema = Joi.object({
  property: Joi.string().custom(isValidObjectId).required(),
  message: Joi.string().min(5).max(500).optional()
});

const updateRequestStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'rejected').required()
});

module.exports = {
  createManagementRequestSchema,
  updateRequestStatusSchema
};

