/*
  HIH6130.js

  I2C driver for the HIH6130 Humidity and Temperature Sensor
*/

'use strict';

const HIH6130_DEFAULT_ADDRESS = 0x27;
const HIH6130_CMD_READ        = 0x04;
const HIH6130_CMD_SIZE        = 0x04; 

class HIH6130 {

  constructor(i2cBusNo, i2cAddress) {
    let i2c = require('i2c-bus');
    this.i2cBus = i2c.openSync(i2cBusNo);
    this.i2cAddress = i2cAddress ? i2cAddress : HIH6130_DEFAULT_ADDRESS;
  }

  readData() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.i2cBus.readI2cBlock(_this.i2cAddress, HIH6130_CMD_READ, HIH6130_CMD_SIZE, new Buffer(4), (err, bytesRead, data) => {
        console.log('DevicesRPi.ReadSensors() read', bytesRead , 'bytes:', data, 'Error: ', err ? err : 'None');

        if(err) {
          return reject(err);
        }

        /*
          data[0] // humidity high byte
          data[1] // humidity low byte
          data[2] // temperature high byte
          data[3] // temperature low byte
        */

        var status   = (data[0] & 0xc0) >> 6;
        var humidity = (((data[0] & 0x3f) << 8) + data[1]) / 0x3fff * 100;
        var tempC    = (((data[2] << 8) + data[3]) >> 2) / 0x3fff * 165 - 40;

        var data = {
          status   : status,
          humidity : humidity,
          tempC    : tempC,
          raw      : '0x' + data.toString('hex')
        };

        return resolve(data);
      });
    });
  }

  HIH6130_STATUS_NORMAL() {
    return 0x00;
  }

  HIH6130_STATUS_STALE() {
    return 0x01;
  }

  HIH6130_STATUS_COMMAND_MODE() {
    return 0x02;
  }

  HIH6130_STATUS_DIAGNOSTIC() {
    return 0x03;
  }

}

module.exports = HIH6130;
