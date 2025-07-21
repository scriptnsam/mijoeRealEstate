const ManagementRequest = require('../models/ManagementRequest');
const Property = require('../models/Property');
const { resSuccess, resError } = require('../utils/response');
const { createManagementRequestSchema, updateRequestStatusSchema } = require('../validators/managementRequest')

// @desc    Submit a management request
// @route   POST /api/manage
// @access  Private (Authenticated users)
exports.createManagementRequest = async (req, res) => {
  try {
    const { error, value } = createManagementRequestSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map(e => e.message).join(', ');
      return resError(res, messages, 400);
    }

    const { property, message } = value;

    // Check if property exists
    const foundProperty = await Property.findById(property);
    if (!foundProperty) return resError(res, 'Property not found', 404);

    // Prevent duplicate requests by same user
    const existingRequest = await ManagementRequest.findOne({
      property,
      requester: req.user.id,
      status: 'pending'
    });

    if (existingRequest) return resError(res, 'You already submitted a request for this property.');

    const request = await ManagementRequest.create({
      property,
      message,
      requester: req.user.id
    });

    resSuccess(res, 'Management request submitted', request);
  } catch (err) {
    resError(res, err.message);
  }
};

// @desc    Get all management requests (admin/agent)
// @route   GET /api/manage
// @access  Private (Admin/Agent)
exports.getAllManagementRequests = async (req, res) => {
  try {
    const requests = await ManagementRequest.find()
      .populate('property', 'title location')
      .populate('requester', 'fullname email');

    resSuccess(res, 'Management requests fetched', requests);
  } catch (err) {
    resError(res, err.message);
  }
};

// @desc    Get single management request
// @route   GET /api/manage/:id
// @access  Private
exports.getManagementRequestById = async (req, res) => {
  try {
    const request = await ManagementRequest.findById(req.params.id)
      .populate('property', 'title location')
      .populate('requester', 'fullname email');

    if (!request) return resError(res, 'Request not found', 404);

    resSuccess(res, 'Request fetched', request);
  } catch (err) {
    resError(res, err.message);
  }
};

// @desc    Update status (approve/reject)
// @route   PATCH /api/manage/:id/status
// @access  Private (Admin/Agent)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { error, value } = updateRequestStatusSchema.validate(req.body);

    if (error) {
      const messages = error.details.map(e => e.message).join(', ');
      return resError(res, messages, 400);
    }

    const { status } = value;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return resError(res, 'Invalid status value', 400);
    }

    const request = await ManagementRequest.findById(req.params.id);
    if (!request) return resError(res, 'Request not found', 404);

    request.status = status;
    await request.save();

    resSuccess(res, `Request ${status}`, request);
  } catch (err) {
    resError(res, err.message);
  }
};

// @desc    Delete a management request (admin or owner)
// @route   DELETE /api/manage/:id
// @access  Private (Admin/Owner of request)
exports.deleteManagementRequest = async (req, res) => {
  try {
    const request = await ManagementRequest.findById(req.params.id);
    if (!request) return resError(res, 'Request not found', 404);

    // Only requester or admin can delete
    if (req.user.role !== 'admin' && request.requester.toString() !== req.user.id) {
      return resError(res, 'Unauthorized', 401);
    }

    await request.deleteOne();
    resSuccess(res, 'Request deleted');
  } catch (err) {
    resError(res, err.message);
  }
};

