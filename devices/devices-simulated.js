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

  ledOn() {
    console.log('DevicesSimulated.LEDOn()');
    return new Promise((resolve, reject) => resolve('OK'));
  }

  ledOff() {
    console.log('DevicesSimulated.LEDOff()');
    return new Promise((resolve, reject) => resolve('OK'));
  }

  readSensors() {
    console.log('DevicesSimulated.ReadSensors()');

    return new Promise((resolve, reject) => {

      // TODO: Can be fancier here. Maybe have temperature and humidity drift by time of day, etc.
      //
      const humidity  = 40.00 + Math.random();
      const tempC     = 22.00 + Math.random();
      const barometer = 29.00 + Math.random();

      resolve({
        humidity      : humidity.toFixed(2),
        temperature_C : tempC.toFixed(2),
        temperature_F : deviceUtils.celsiusToFahrenheit(tempC).toFixed(2),
        pressure_inHg : barometer.toFixed(2)
      });
    });
  }
}

module.exports = DevicesSimulated;
