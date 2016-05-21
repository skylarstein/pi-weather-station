/*
  HIH6130.js

  I2C driver for the HIH6130 Humidity and Temperature Sensor
*/

'use strict';

class HIH6130 {

  constructor(i2cBusNo, i2cAddress) {
    const i2c = require('i2c-bus');
    this.i2cBus = i2c.openSync(i2cBusNo ? i2cBusNo : 1);
    this.i2cAddress = i2cAddress ? i2cAddress : HIH6130.HIH6130_DEFAULT_I2C_ADDRESS();

    this.HIH6130_CMD_SIZE = 0x04;
    this.HIH6130_CMD_READ = 0x04;
  }

  readSensorData() {
    return new Promise((resolve, reject) => {
      this.i2cBus.readI2cBlock(this.i2cAddress, this.HIH6130_CMD_READ, this.HIH6130_CMD_SIZE, new Buffer(4), (err, bytesRead, data) => {
        //console.log('DevicesRPi.ReadSensors() read', bytesRead , 'bytes:', data, 'Error: ', err ? err : 'None');

        if(err) {
          return reject(err);
        }

        /*
          data[0] // humidity high byte
          data[1] // humidity low byte
          data[2] // temperature high byte
          data[3] // temperature low byte
        */

        const status        = (data[0] & 0xc0) >> 6;
        const humidity      = (((data[0] & 0x3f) << 8) + data[1]) / 0x3fff * 100;
        const temperature_C = (((data[2] << 8) + data[3]) >> 2) / 0x3fff * 165 - 40;

        return resolve({
          status        : status,
          humidity      : humidity,
          temperature_C : temperature_C
        });
      });
    });
  }

  static HIH6130_DEFAULT_I2C_ADDRESS() {
    return 0x27;
  }

  static HIH6130_STATUS_NORMAL() {
    return 0x00;
  }

  static HIH6130_STATUS_STALE() {
    return 0x01;
  }

  static HIH6130_STATUS_COMMAND_MODE() {
    return 0x02;
  }

  static HIH6130_STATUS_DIAGNOSTIC() {
    return 0x03;
  }

}

module.exports = HIH6130;
