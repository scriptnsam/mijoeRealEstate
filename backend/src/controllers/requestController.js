const Request = require('../models/Request');
const { resSuccess, resError } = require('../utils/response');

exports.createRequest = async (req, res) => {
  try {
    const request = await Request.create({ ...req.body, user: req.user.id });
    resSuccess(res, 'Request submitted', request);
  } catch (err) {
    resError(res, err.message);
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate('user', 'fullname email');
    resSuccess(res, 'All requests fetched', requests);
  } catch (err) {
    resError(res, err.message);
  }
};

exports.getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ user: req.user.id });
    resSuccess(res, 'User requests fetched', requests);
  } catch (err) {
    resError(res, err.message);
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!request) return resError(res, 'Request not found', 404);
    resSuccess(res, 'Request status updated', request);
  } catch (err) {
    resError(res, err.message);
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) return resError(res, 'Request not found', 404);
    resSuccess(res, 'Request deleted');
  } catch (err) {
    resError(res, err.message);
  }
};

