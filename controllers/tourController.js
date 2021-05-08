const Tour = require('../models/tourModels');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');
// const APIFeatures = require('../utils/apiFeatures');
// const AppError = require('../utils/appError');

exports.alias = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  next();
};

// const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    // {
    //   $match: {
    //     ratingsAverage: 4.9,
    //   },
    // },
    {
      $group: {
        _id: '$difficulty',
        avgPrice: { $avg: '$price' },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
