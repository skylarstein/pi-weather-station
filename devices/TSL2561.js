/*
  TSL2561.js

  A wrapper around the TSL2561 Luminosity sensor driver.
*/

'use strict';

class TSL2561 {
  constructor() {
    const RaspiSensors = require('raspi-sensors');

    this.tsl2561   = new RaspiSensors.Sensor({ type : 'TSL2561', address : 0X39 }, 'light_sensor');    
    this.lux       = 0;
    this.timestamp = null;
    this.error     = null;

    this.tsl2561.fetchInterval((err, data) => {
      if(err) {
        this.lux       = -1;
        this.timestamp = null;
        this.error     = err.cause;
      }
      else {
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
        this.lux       = data.value;
        this.timestamp = data.date;
        this.error     = null;
      }
    }, 1); // 1Hz
  }

  readSensorData() {
    return { lux : this.lux, timestamp : this.timestamp, error : this.error };
  }
}

module.exports = TSL2561;
