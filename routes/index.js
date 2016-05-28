/*
  index.js

  Express routes for our application
*/

'use strict';

const router = require('express').Router();
const os     = require('os');
const path   = require('path');
const _      = require('lodash');

// DeviceManager provides a platform-independent interface to our hardware devices
// so we can build and run this application on different platforms.
//
const DeviceManager = require('../devices/device-manager.js');
const deviceManager = new DeviceManager();
const viewsRoot     = path.join(__dirname, '../views');

router.get('/', (req, res) =>
  deviceManager.readSensors()
    .then(data => renderIndex(res, data))
    .catch(error => renderIndex(res, null, error)));

const renderIndex = (res, data, error) =>
  res.render(path.join(viewsRoot, 'index.ejs'), {
    sensorData     : toFixedDeep(data, 2, ['lat', 'lon']),
    error          : error,
    platformUptime : os.uptime(),
    processUptime  : process.uptime()
  });

const toFixedDeep = (obj, precision, ignore) => {
  _.forIn(obj, (val, key) => {
    if(_.isNumber(val) && val % 1 != 0 && (!ignore || !_.includes(ignore, key))) {
      obj[key] = Number(val.toFixed(precision));
    }
    if(_.isArray(val)) {
      val.forEach(el => {
        if(_.isObject(el)) {
          toFixedDeep(el, precision, ignore);
        }
      });
    }
    if(_.isObject(obj[key])) {
      toFixedDeep(obj[key], precision, ignore);
    }
  });
  return obj;
}

router.get('/sensors', (req, res) =>
  deviceManager.readSensors()
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
