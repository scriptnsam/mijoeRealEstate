const { submitMessage, getMessages } = require('../controllers/contactController');
const { restrictTo, authenticate } = require('../middleware/auth');

const router = require('express').Router();

router.get('/', authenticate, restrictTo('admin'), getMessages)
router.post('/', submitMessage)

module.exports = router;
