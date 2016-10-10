/*
  TSL2561.js

  A wrapper around the TSL2561 Luminosity sensor driver.
*/

'use strict';

class TSL2561 {
  constructor() {
    const RaspiSensors = require('raspi-sensors');
    this.tsl2561 = new RaspiSensors.Sensor({ type : 'TSL2561', address : 0X39 }, 'light_sensor');
  }

  readSensorData() {
    return new Promise((resolve, reject) => {
      this.tsl2561.fetch((err, data) => {
        if(err) {
          return reject(err.cause);
        }
        /* data = {
            type         : 'Light',
            unit         : 'Lux',
            unit_display : 'Lux',
            value        : 670,
            date         : 2016-10-09T23:07:22.949Z,
            timestamp    : 1476054442949,
            sensor_name  : 'light_sensor',
            sensor_type  : 'TSL2561'
          }
        */
        resolve({ lux : data.value, timestamp : data.date });
      });
    });
  }
}

module.exports = TSL2561;
