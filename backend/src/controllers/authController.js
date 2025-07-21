const User = require('../models/User');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { resError, resSuccess } = require('../utils/response');

// Define Joi validation schema
const registerSchema = Joi.object({
  fullname: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().pattern(/^\d{10,15}$/).required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().min(6).required()
});


// Controller function
const registerUser = async (req, res) => {
  try {
    // Validate incoming data
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return resError(res, error.details[0].message, 400)
    }

    const { fullname, email, phoneNumber, password, confirmPassword } = value;

    // Check if both passwords are thesame
    if (password !== confirmPassword) {
      return resError(res, 'Passwords are not thesame', 400);
    }

    // Check if user with email or phone already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });
    if (existingUser) {
      return resError(res, "Email or phone number already in use", 409)
    }

    // Create new user (password is hashed by the model's pre-save hook)
    const newUser = new User({ fullname, email, phoneNumber, password });
    await newUser.save();

    // Respond (omit password from response)
    const { password: _, ...userData } = newUser.toObject();
    return resSuccess(res, 'Registration successful', { user: userData }, 201)

  } catch (err) {
    console.error(err);
    return resError(res)
  }
};



// Joi schema for login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});


const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      tokenVersion: user.tokenVersion
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};


const loginUser = async (req, res) => {
  try {
    // Validate request body
    const { error: validationError, value } = loginSchema.validate(req.body);
    if (validationError) {
      return resError(res, validationError.details[0].message, 400);
    }

    const { email, password } = value;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return resError(res, 'Invalid email or password', 401);
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return resError(res, 'Invalid email or password', 401);
    }


    // 🔐 Invalidate previous tokens
    user.tokenVersion += 1;
    await user.save();



    const token = generateToken(user);

    const { password: _, ...userData } = user.toObject();

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return resSuccess(res, 'Login successful', {
      user: userData,
      token
    }, 200);

  } catch (err) {
    console.error(err);
    return resError(res, 'Server error', 500);
  }
};


const logoutUser = async (req, res) => {
  try {
    // Invalidate token by bumping tokenVersion
    req.user.tokenVersion += 1;
    await req.user.save();

    // Clear HTTP-only cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return resSuccess(res, 'Logout successful', null, 200);
  } catch (err) {
    console.error(err);
    return resError(res, 'Server error during logout', 500);
  }
};

module.exports = { loginUser, registerUser, logoutUser };
