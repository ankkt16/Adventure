const express = require('express');

const app = express();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const AppError = require('./utils/appError');
const globalError = require('./controllers/globalError');

// Security- setting http headers
app.use(helmet());

// Body parser
app.use(express.json());

// sanitize against No Sql attack
app.use(mongoSanitize());

// sanitize against xss attacks
app.use(xss());

// Preventing parameter pollution
app.use(
  hpp({
    whitelist: [
      'duation',
      'price',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
    ],
  })
);

// Security- limit number of request from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again later',
});

app.use('/api', limiter);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(`The url ${req.originalUrl} was not found in the server`, 404)
  );
});

app.use(globalError);

module.exports = app;
