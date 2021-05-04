const expres = require('express');

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// mergeParams option is for nested routes
const router = expres.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
