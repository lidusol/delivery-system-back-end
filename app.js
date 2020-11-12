const express = require("express");
// const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require('passport');
const mongoose = require("mongoose");
const config = require('./config/database');
const port = 3000;
const app = express();

const users = require('./routes/users');
const orders = require('./routes/orders');

// mongoose.connect(config.database);
mongoose.connect(config.database, { useMongoClinet: true });

mongoose.connection.once('open', () => {
  console.log("connected to database " + config.database);
});

mongoose.connection.on('error', (err) => {
  console.log("database error " + config.database + err);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use(cors());

// app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/users', users);
app.use('/orders', orders);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});


// app.get('/', (req, res) => {
//   res.send("Invalid Endpoint");
// });

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

app.listen(port, () => {
  console.log("Server started on port " + port);
});

module.exports = app;