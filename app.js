/*
  app.js

  Express app implementation for our Raspberry Pi Weather Station
*/

"use strict";

const os            = require('os');
const express       = require("express");
const app           = express();
const DeviceManager = require('./devices/device-manager.js');
const path          = require('path');
const viewsRoot     = path.join(__dirname, 'views');

// DeviceManager provides a platform-independent interface to our hardware devices
// so we can build and run this application on different platforms.
//
const deviceManager = new DeviceManager();

app.use(express.static(path.join(__dirname, '/public')));

app.get("/", function (req, res) {
  deviceManager.ReadSensors()
    .then(function(data) {
      renderIndex(res, data);
    })
    .catch(function(error) {
      renderIndex(res, null, error);
    });
});

function renderIndex(res, data, error) {
  res.render(path.join(viewsRoot, 'index.ejs'), {
    sensorData     : data,
    error          : error,
    platformUptime : os.uptime(),
    processUptime  : process.uptime()
  });
}

app.post("/led-on", function (req, res) {
  deviceManager.LEDOn()
    .then(function(data) {
      res.status(200).send(data);
    })
    .catch(function(err) {
      res.status(500).send(err);
    });
});

app.post("/led-off", function (req, res) {
  deviceManager.LEDOff()
    .then(function(data) {
      res.status(200).send(data);
    })
    .catch(function(err) {
      res.status(500).send(err);
    });
});

module.exports = app;
