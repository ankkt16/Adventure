const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Tour = require('../models/tourModels');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
// const factory = require('./factoryHandler');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // GET the tour
  const tour = await Tour.findById(req.params.tourId);

  //   Create payment session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.id}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          'https://www.google.com/imgres?imgurl=https%3A%2F%2Fcdn.britannica.com%2F74%2F114874-050-6E04C88C%2FNorth-Face-Mount-Everest-Tibet-Autonomous-Region.jpg&imgrefurl=https%3A%2F%2Fwww.britannica.com%2Fplace%2FHimalayas&tbnid=DAvthBA8EVfh5M&vet=12ahUKEwiDx_r-jJXyAhWxgUsFHabmAUQQMygBegUIARDIAQ..i&docid=iPhprSUc8Eg1AM&w=1600&h=878&q=himalayas&ved=2ahUKEwiDx_r-jJXyAhWxgUsFHabmAUQQMygBegUIARDIAQ',
        ],
        amount: tour.price * 100,
        currency: 'inr',
        quantity: 1,
      },
    ],
  });

  // Send sessions as response
  res.status(200).json({
    status: 'success',
    session,
  });
});
