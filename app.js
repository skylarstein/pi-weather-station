/*
  app.js

  Express app implementation for our Raspberry Pi Weather Station
*/

"use strict";

const os            = require('os');
const express       = require("express");
const app           = express();
const moment        = require('moment');
const DeviceManager = require('./devices/device-manager.js');
const path          = require('path');
const viewsRoot     = path.join(__dirname, 'views');

// DeviceManager provides a platform-independent interface to our hardware devices
// so we can build and run this application on different platforms.
//
const deviceManager = new DeviceManager();

app.use(express.static(path.join(__dirname, '/public')));

app.get("/", function (req, res) {
  deviceManager.ReadSensors(function(data) {
    res.render(path.join(viewsRoot, 'index.ejs'), { sensorData : data });
  });
});

app.post("/led-on", function (req, res) {
  deviceManager.LEDOn(function(err) {
    res.status(err ? 500 : 200).send(err ? err : 'OK');
  });
});

app.post("/led-off", function (req, res) {
  deviceManager.LEDOff(function(err) {
    res.status(err ? 500 : 200).send(err ? err : 'OK');
  });
});

module.exports = app;
