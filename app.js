/*
  app.js

  Express app implementation for our Raspberry Pi Weather Station
*/

'use strict';

const express = require('express');
const app     = express();
const routes  = require('./routes/index.js');

app.use(express.static(__dirname + '/public')); // serve up static assets

app.use('/', routes); // mount our app routes

module.exports = app;
