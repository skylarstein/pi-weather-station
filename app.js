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

// DeviceManager provides a platform-independent interface to our hardware devices
// so we can build and run this application on different platforms.
//
const deviceManager = new DeviceManager();

app.get("/", function (req, res) {
  deviceManager.ReadSensors(function(data) {
  res.send('Welcome to the Raspberry Pi Weather Station!<br><br>Sensors: ' +
    JSON.stringify(data) +
    '<br><br>Platform uptime:' +
    JSON.stringify(moment.duration(os.uptime(), 'seconds')._data));
  });
});

app.get("/on", function (req, res) {
  deviceManager.LEDOn(function() {
    res.send("LEDOn");
  });
});

app.get("/off", function (req, res) {
  deviceManager.LEDOff(function() {
    res.send("LEDOff");
  });
});

module.exports = app;
