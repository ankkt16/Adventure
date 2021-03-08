const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, (err) => {
    if (err) console.log(err);
  })
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  if (tour === undefined) {
    res.status(404).json({
      status: 'failed',
      message: 'No such tours exist',
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  }
};

const createTour = (req, res) => {
  const tourId = tours[tours.length - 1].id + 1;

  const newTour = Object.assign({ id: tourId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      // if (err) console.log(err);
      res.status(201).json(newTour);
    }
  );
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;

  if (tours.length <= id) {
    res.status(404).json({
      status: 'failed',
      message: 'No such tours exist',
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: 'Updated',
    });
  }
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;

  if (tours.length <= id) {
    res.status(404).json({
      status: 'failed',
      message: 'No such tours exist',
    });
  } else {
    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This is not yet defined',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This is not yet defined',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This is not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This is not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This is not yet defined',
  });
};

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
