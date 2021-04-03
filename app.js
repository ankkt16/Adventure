const express = require('express');

const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const AppError = require('./utils/appError');
const globalError = require('./controllers/globalError');

app.use(express.json());

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(`The url ${req.originalUrl} was not found in the server`, 404)
  );
});

app.use(globalError);

module.exports = app;
