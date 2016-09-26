/*
  app.js

  Express app implementation for our Raspberry Pi Weather Station
*/

'use strict';

const express   = require('express');
const app       = express();
const cors      = require('cors');
const routes    = require('./routes/index.js');
const Publisher = require('./controllers/publisher.js');

app.use(cors()); // easier front end testing from local dev machine with CORS enabled
app.use(express.static(__dirname + '/public')); // serve up static assets
app.use('/', routes); // mount app routes

//Publisher.instance().startPublishing();

module.exports = app;
