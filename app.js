/*
  app.js

  Express app implementation for our Raspberry Pi Weather Station
*/

'use strict';

const express = require('express');
const app     = express();
const cors    = require('cors');
const routes  = require('./routes/index.js');

app.use(cors());
app.use(express.static(__dirname + '/public')); // serve up static assets
app.use('/', routes); // mount our app routes

module.exports = app;
