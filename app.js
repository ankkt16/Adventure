const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, (err) => {
    if (err) console.log(err);
  })
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {
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
});

app.delete('/api/v1/tours/:id', (req, res) => {
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
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
