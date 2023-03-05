const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
dotenv.config();

const errorHandler = require('./utils/error-handler');

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.options('*', cors())
app.use(cookieParser());
app.use(errorHandler);
app.use(morgan('tiny'));

//Routes import
const userRoutes = require('./routes/users');
const itemRoutes = require('./routes/items');
const itemsOwnershipsRoutes = require('./routes/itemOwnerships');
const farmsOwnershipsRoutes = require('./routes/farmOwnerships');

const { urlencoded } = require('express');

//Routes use
app.use('/users', userRoutes);
app.use('/items', itemRoutes);
app.use('/itemsOwnerships', itemsOwnershipsRoutes);
app.use('/farmsOwnerships', farmsOwnershipsRoutes);

const PORT = process.env.PORT || 3000;
const mongoDB = process.env.DB_URL;

//For deprecation warning - v1
mongoose.set('strictQuery', false);

//Database connection
mongoose
  .connect(mongoDB, 
    { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    })
  .then(() => console.log("Database was connected successfuly!"))
  .catch((err) => console.log(err));

  //Server running
  app.listen(PORT, () => {
    console.log(`Server is up and running!`);
  });