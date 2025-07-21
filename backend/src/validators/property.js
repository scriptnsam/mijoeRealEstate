const Joi = require('joi');

exports.propertySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('', null),
  type: Joi.string().valid('sale', 'rent', 'hostel', 'lease').required(),
  category: Joi.string().valid('house', 'apartment', 'land', 'hostel').required(),
  location: Joi.string().required(),
  price: Joi.number().positive().required(),
  images: Joi.array().items(Joi.string().uri()).default([]),
  isAvailable: Joi.boolean().default(true)
});

