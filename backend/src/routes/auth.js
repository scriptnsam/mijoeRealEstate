const {registerUser, loginUser, logoutUser} = require('../controllers/authController');
const {authenticate} = require('../middleware/auth');
const {resSuccess, resError} = require('../utils/response');
const jwt = require('jsonwebtoken')

const router = require('express').Router();

router.post('/login', loginUser)
router.post('/register', registerUser);
router.get('/logout', authenticate, logoutUser);
router.get('/me', (req, res) => {
  const token = req.cookies.token;
  if (!token) return resError(res, "Not Authorized", 401);

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return resSuccess(res, 'User logged in', {user})
  } catch (err) {
    return resError(res, "Invalid token", 401)
  }
});

module.exports = router;
