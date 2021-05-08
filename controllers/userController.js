const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');

const filter = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((element) => {
    if (allowedFields.includes(element)) newObj[element] = obj[element];
  });

  return newObj;
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This is not yet defined! Use /signup route',
  });
};

exports.profileUpdate = catchAsync(async (req, res, next) => {
  const filteredBody = filter(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

exports.deactivateAccount = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
