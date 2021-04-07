const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signInToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = signInToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please enter email and password', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.validatePassword(password, user.password)))
    return next(new AppError('Invalid email or Password', 401));

  // console.log(user);
  const token = signInToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
    message: 'logged in successfully',
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // Check if token is present in the headers
  let token;
  // console.log(req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return next(
      new AppError('You are not logged in Please log in to view tours', 401)
    );
  }

  // Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exist
  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return next(
      new AppError('This user no longer exist. Try logging in again', 401)
    );

  // Check if user password has been changed after token was issued

  if (currentUser.hasPasswordChangedAfter(decoded.iat))
    return next(
      new AppError(
        'Your password has recently changed. Please log in again to continue',
        401
      )
    );

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return next(
      new AppError('You are not authorized to perform this action', 403)
    );

  next();
};
