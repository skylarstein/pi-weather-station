/*
  app.js

  Express app implementation for our Raspberry Pi Weather Station
*/

"use strict";

const os            = require('os');
const express       = require('express');
const app           = express();
const DeviceManager = require('./devices/device-manager.js');
const path          = require('path');
const viewsRoot     = path.join(__dirname, 'views');

// DeviceManager provides a platform-independent interface to our hardware devices
// so we can build and run this application on different platforms.
//
const deviceManager = new DeviceManager();

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) =>
  deviceManager.ReadSensors()
    .then(data => renderIndex(res, data))
    .catch(error => renderIndex(res, null, error)));

const renderIndex = (res, data, error) =>
  res.render(path.join(viewsRoot, 'index.ejs'), {
    sensorData     : data,
    error          : error,
    platformUptime : os.uptime(),
    processUptime  : process.uptime()
  });

app.post('/led-on', (req, res) =>
  deviceManager.LEDOn()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err)));

app.post('/led-off', (req, res) =>
  deviceManager.LEDOff()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err)));

module.exports = app;
