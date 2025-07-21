const mongoose = require('mongoose');
const Property = require('../models/Property');
const { resSuccess, resError } = require('../utils/response');
const { propertySchema, updatePropertySchema } = require('../validators/property')
const uploadToCloudinary = require('../utils/uploadToCloudinary');

exports.createProperty = async (req, res) => {
  try {
    // Validate input
    const { error, value } = propertySchema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map(err => err.message).join(', ');
      return resError(res, messages, 400);
    }

    // Handle image upload if present
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploads = req.files.map(file =>
        uploadToCloudinary(file.buffer, file.originalname)
      );
      imageUrls = await Promise.all(uploads);
    }

    const property = await Property.create({
      ...value,
      images: imageUrls,
      listedBy: req.user.id
    });

    resSuccess(res, 'Property created successfully', property);
  } catch (err) {
    resError(res, err.message);
  }
};


exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('listedBy', 'fullname email');
    // check if properties length is equal to 0
    if (properties.length === 0) return resError(res, 'Properties not found', 404);

    resSuccess(res, 'Properties fetched', properties);
  } catch (err) {
    resError(res, err.message);
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    // Cast id to ObjectId
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return resError(res, 'Invalid id', 400)
    }

    const property = await Property.findById(id).populate('listedBy', 'fullname email');
    if (!property) return resError(res, 'Property not found', 404);
    resSuccess(res, 'Property fetched', property);
  } catch (err) {
    resError(res, err.message);
  }
};

exports.updateProperty = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = updatePropertySchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false
    });

    if (error) {
      const messages = error.details.map(err => err.message).join(', ');
      return resError(res, messages, 400);
    }

    const { id } = req.params;

    // Cast id to ObjectId
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return resError(res, 'Invalid id', 400)
    }

    // Find property
    const property = await Property.findById(id);
    if (!property) return resError(res, 'Property not found', 404);

    // Check ownership
    if (property.listedBy.toString() !== req.user.id) {
      return resError(res, 'Unauthorized', 401);
    }

    // Upload new images if present
    if (req.files && req.files.length > 0) {
      const uploads = req.files.map(file =>
        uploadToCloudinary(file.buffer, file.originalname)
      );
      const imageUrls = await Promise.all(uploads);
      value.images = imageUrls;
    } else {
      value.images = property.images
    }

    // Apply update
    Object.assign(property, value);
    await property.save();

    resSuccess(res, 'Property updated', property);
  } catch (err) {
    resError(res, err.message);
  }
};


exports.deleteProperty = async (req, res) => {
  try {

    const { id } = req.params;

    // Cast id to ObjectId
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return resError(res, 'Invalid id', 400)
    }

    const property = await Property.findById(id);
    if (!property) return resError(res, 'Property not found', 404);

    // Check if current user listed the property
    if (property.listedBy.toString() !== req.user.id) {
      return resError(res, 'Unauthorized', 401);
    }

    await property.deleteOne(); // or await Property.findByIdAndDelete(req.params.id);

    resSuccess(res, 'Property deleted');
  } catch (err) {
    resError(res, err.message);
  }
};
