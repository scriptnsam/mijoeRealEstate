const User = require("../models/User");
const { resSuccess, resError } = require("../utils/response");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    const usersNew = [];

    users.map((user) => {
      const { password: _, __v: __, tokenVersion: ___, ...userData } = user.toObject();
      usersNew.push(userData)
    })

    resSuccess(res, 'Users fetched', usersNew);
  } catch (err) {
    resError(res, err.message);
  }
};
