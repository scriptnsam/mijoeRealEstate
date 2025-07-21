const router = require('express').Router();
const { createManagementRequest, getManagementRequestById, getAllManagementRequests, updateRequestStatus, deleteManagementRequest } = require('../controllers/managementRequestController');
const { authenticate, restrictTo } = require('../middleware/auth');

router.post('/', authenticate, createManagementRequest); // protected
router.get('/', authenticate, restrictTo('admin', 'agent'), getAllManagementRequests); // admin view
router.get('/:id', authenticate, restrictTo('admin', 'agent'), getManagementRequestById); // admin view
router.put('/:id', authenticate, restrictTo('admin', 'agent'), updateRequestStatus); // admin
router.delete('/:id', authenticate, restrictTo('user', 'admin'), deleteManagementRequest); // owner/admin

module.exports = router;
