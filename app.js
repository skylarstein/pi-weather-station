/*
  app.js

  Express app implementation for our Raspberry Pi Weather Station
*/

'use strict';

const express           = require('express');
const app               = express();
const cors              = require('cors');
const routes            = require('./routes/index.js');
const DatabasePublisher = require('./controllers/publisher-db.js');
const mongoose          = require('mongoose');

app.use(cors()); // easier front end testing from local dev machine with CORS enabled
app.use(express.static(__dirname + '/public')); // serve up static assets
app.use('/', routes); // mount app routes

// Connect to the DB
//
mongoose.set('debug', true);
mongoose.Promise = global.Promise; // Mongoose 5.0 will use native promises. Until then explicitly request it.

mongoose.connection.on('connected', () => console.log('Connected to database'));
mongoose.connection.on('disconnected', () => console.log('Disconnected from database'));
mongoose.connection.on('error', (err) => console.error(`MongoDB error: ${err}`));

mongoose.connect(process.env.DB_URL, (err) => {
  if(err) {
    console.error(`mongoose.connect error: ${err}`);
  }
});

DatabasePublisher.instance().startPublishing();

module.exports = app;
