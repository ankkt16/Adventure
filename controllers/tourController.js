const Tour = require('../models/tourModels');

exports.getAllTours = (req, res) => {
  res.status(200).json({
    // status: 'success',
    // result: tours.length,
    // data: {
    //   tours,
    // },
  });
};

exports.getTour = (req, res) => {
  res.status(200).json({
    // status: 'success',
    // data: {
    //   tour,
    // },
  });
};

exports.createTour = (req, res) => {
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  // res.status(201).json(newTour);
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: 'Updated',
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
