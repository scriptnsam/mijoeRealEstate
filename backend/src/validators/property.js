const Joi = require('joi');

exports.propertySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('', null),
  type: Joi.string().valid('sale', 'rent', 'hostel').required(),
  category: Joi.string().valid('house', 'apartment', 'land', 'hostel').required(),
  location: Joi.string().required(),
  price: Joi.number().positive().required(),
  // alow at least one image
  images: Joi.array().min(1).items(Joi.string()),
  isAvailable: Joi.boolean().default(true)
});


exports.updatePropertySchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow('', null),
  type: Joi.string().valid('sale', 'rent', 'hostel'),
  category: Joi.string().valid('house', 'apartment', 'land', 'hostel'),
  location: Joi.string(),
  price: Joi.number().positive(),
  // alow at least one image
  images: Joi.array().min(1).items(Joi.string()),
  isAvailable: Joi.boolean().default(true)
})
