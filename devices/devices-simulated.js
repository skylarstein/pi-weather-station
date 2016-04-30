/*
  devices-simulated.js

  A simulated interface to our devices so we can run this application on any platform.
*/

'use strict';

const DevicesBase = require('./devices-base.js');
const deviceUtils = require('./device-utils.js');

class DevicesSimulated extends DevicesBase {

  constructor() {
    super();
    console.log('Creating DevicesSimulated');
  }

  LEDOn() {
    console.log('DevicesSimulated.LEDOn()');
    return new Promise((resolve, reject) => resolve('OK'));
  }

  LEDOff() {
    console.log('DevicesSimulated.LEDOff()');
    return new Promise((resolve, reject) => resolve('OK'));
  }

  ReadSensors() {
    console.log('DevicesSimulated.ReadSensors()');

    return new Promise((resolve, reject) => {

      // TODO: Can be fancier here. Maybe have temperature and humidity drift by time of day, etc.
      //
      let humidity  = 40.00 + Math.random();
      let tempC     = 24.00 + Math.random();
      let altitude  = 10.00;
      let barometer = 30.00;

      var data = {
        status    : 0,
        humidity  : humidity.toFixed(2),
        tempC     : tempC.toFixed(2),
        tempF     : deviceUtils.celsiusToFahrenheit(tempC).toFixed(2),
        altitude  : altitude,
        barometer : barometer
      };

      resolve(data);
    });
  }
}

module.exports = DevicesSimulated;
