const { getUsers } = require('../controllers/usersController');
const { authenticate, restrictTo } = require('../middleware/auth');

const router = require('express').Router();

router.get('/', authenticate, restrictTo('admin'), getUsers);

module.exports = router;
