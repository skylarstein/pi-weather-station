/*
  index.js

  Express routes for our application
*/

'use strict';

const router     = require('express').Router();
const path       = require('path');
const SensorData = require('../model/sensor-data.js');
const moment     = require('moment');

// DeviceManager provides a platform-independent interface to our hardware devices
// so we can install and run this application on different platforms.
//
const DeviceManager = require('../devices/device-manager.js');
const deviceManager = DeviceManager.instance();

router.get('/', (req, res) =>
  res.sendFile(path.join(_dirname, 'public', 'index.html')));

// GET live sensor data
//
router.get('/sensors/live', (req, res) =>
  deviceManager.readSensors()
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err)));

// GET sensor history data
//
router.get('/sensors/history/:startDate/:endDate', (req, res) => {

  let query = { deviceId : process.env.PI_WEATHER_STATION_DEVICE_ID };

  if(!moment(req.params.startDate, moment.ISO_8601).isValid()) {
    return res.status(400).send('Invalid ISO 8601 startDate')
  }

  if(!moment(req.params.endDate, moment.ISO_8601).isValid()) {
    return res.status(400).send('Invalid ISO 8601 endDate')
  }

  query.timestamp = {'$gte' : req.params.startDate, '$lte' : req.params.endDate };

  SensorData.find(query)
            .select('-_id -__v -deviceId') // Keep it clean for the caller. Could also {select : false} in the SensorData schema definition.
            .exec((err, docs) => err ? res.status(500).send(err) : res.status(200).send(docs));
});

// GET GPS location, timezone, other associated data
//
router.get('/location', (req, res) =>
  deviceManager.locationDetails()
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err)));

module.exports = router;
