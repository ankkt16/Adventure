const fs = require('fs');


const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, (err) => {
      if (err) console.log(err);
    })
  );
  
  exports.getAllTours = (req, res) => {
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  };
  
  exports.getTour = (req, res) => {
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
  
  exports.createTour = (req, res) => {
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
  
  exports. updateTour = (req, res) => {
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
  
  exports.deleteTour = (req, res) => {
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