const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = `mongodb+srv://Ankit:${process.env.DATABASE_PASSWORD}@cluster0.iidy3.mongodb.net/Adventure?retryWrites=true&w=majority`;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log(con.connection);
    console.log('Connection Successful');
  })
  .catch((err) => {
    console.log(err);
  });

// console.log(process.env);
const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
