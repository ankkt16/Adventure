const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

// const DB = `mongodb+srv://Ankit:${process.env.DATABASE_PASSWORD}@cluster0.iidy3.mongodb.net/Adventure?retryWrites=true&w=majority`;
// const DB1 = `mongodb+srv://Ankit:${process.env.DATABASE_PASSWORD1}@cluster0.i593w.mongodb.net/Adventure1?retryWrites=true&w=majority`;

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    family: 4,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    // console.log(con.connection);
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
