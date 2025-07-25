const resSuccess = (res, message = 'Success', data = {}, code = 200) => {
  return res.status(code).json({
    code,
    status: 'success',
    message,
    data
  });
};

const resError = (res, message = 'An error occurred', code = 500, data = null) => {
  return res.status(code).json({
    code,
    status: 'error',
    message,
    data
  });
};

module.exports = { resSuccess, resError };
