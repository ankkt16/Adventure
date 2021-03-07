const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('hello from the server');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
