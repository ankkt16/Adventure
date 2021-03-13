const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

// console.log(process.env);
const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
