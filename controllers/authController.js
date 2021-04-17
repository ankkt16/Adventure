const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signInToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  });

const sendResponseToken = (res, user, statusCode) => {
  const token = signInToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secret = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  sendResponseToken(res, newUser, 201);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please enter email and password', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.validatePassword(password, user.password)))
    return next(new AppError('Invalid email or Password', 401));

  // console.log(user);
  sendResponseToken(res, user, 200);
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
      new AppError('You are not logged in Please log in to continue', 401)
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new AppError('The user doeas not exist', 404));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your pasword? \n Click on this url: ${resetURL} to change your password.\nIf this was not triggered by you kindly ignore.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token. Valid for 10 minutes',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'An email has been sent to you to change your password',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });
    next(
      new AppError('There was an error sending mail, Try again later!', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get token and encrpt it

  const resetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // find user
  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user)
    return next(
      new AppError(
        'The token is not valid or has expired. Please try again.',
        400
      )
    );

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiresAt = undefined;

  await user.save();

  // set password modified

  sendResponseToken(res, user, 200);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Get the user

  const { email } = req.user;
  const user = await User.findOne({ email }).select('+password');

  // Confirm the current password
  const { currentPassword } = req.body;
  if (!user || !(await user.validatePassword(currentPassword, user.password)))
    return next(new AppError('Invalid password', 401));

  // update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  // log in user
  sendResponseToken(res, user, 200);
});
