/*
  index.js

  Express routes for our application
*/

'use strict';

const router = require('express').Router();
const path   = require('path');

// DeviceManager provides a platform-independent interface to our hardware devices
// so we can build and run this application on different platforms.
//
const DeviceManager = require('../devices/device-manager.js');
const deviceManager = new DeviceManager();

router.get('/', (req, res) =>
  res.sendFile(path.join(_dirname, 'public', 'index.html')));

router.get('/sensors', (req, res) =>
  deviceManager.readSensors()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err)));

router.get('/location', (req, res) =>
  deviceManager.locationDetails()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err)));

router.post('/led-on', (req, res) =>
  deviceManager.ledOn()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err)));

router.post('/led-off', (req, res) =>
  deviceManager.ledOff()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err)));

module.exports = router;
