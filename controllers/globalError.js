const AppError = require('../utils/appError');

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateError = (err) => {
  const value = err.keyValue.name;

  // console.log(Object.keys(err.keyValue)[0]);
  const message = `The value: "${value}" already exist. Please use some other ${
    Object.keys(err.keyValue)[0]
  }`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    Error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('Error 💥️', err);

    res.status(500).json({
      status: 'error',
      message: 'Something Went Wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = JSON.parse(JSON.stringify(err));

    // console.log(err);

    if (err.name === 'CastError') error = handleCastError(error);

    if (error.code === 11000) error = handleDuplicateError(error);

    if (error.name === 'ValidationError') error = handleValidationError(error);

    sendProdError(error, res);
  }
};
