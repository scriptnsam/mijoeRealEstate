const {registerUser, loginUser, logoutUser} = require('../controllers/authController');
const {authenticate} = require('../middleware/auth');

const router = require('express').Router();

router.post('/login', loginUser)
router.post('/register', registerUser);
router.get('/logout', authenticate, logoutUser);


module.exports = router;
