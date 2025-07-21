const router = require('express').Router();
const { createRequest, getUserRequests, getAllRequests, updateRequestStatus, deleteRequest } = require('../controllers/requestController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, createRequest); // protected
router.get('/', getAllRequests); // admin view
router.get('/my', getUserRequests); // user view
router.put('/:id', authenticate, updateRequestStatus); // admin
router.delete('/:id', authenticate, deleteRequest); // user/admin

module.exports = router;
