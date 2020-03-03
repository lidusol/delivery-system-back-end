const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require('passport');
const mongoose = require("mongoose");
const config = require('./config/database');

const port = 3000;
const app = express();

const users = require('./routes/users');
const items = require('./routes/items');

mongoose.connect(config.database);

mongoose.connection.once('open', () => {
  console.log("connected to database " + config.database);
});

mongoose.connection.on('error', (err) => {
  console.log("database error " + config.database + err);
});

app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);
app.use('/items', items);

app.get('/', (req, res) => {
  res.send("Invalid Endpoint");
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
  console.log("server started on port " + port);
});