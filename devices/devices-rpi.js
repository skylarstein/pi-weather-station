/*
  devices-rpi.js

  A direct hardware interface to our RasbperryPi devices.
*/

"use strict";

const LED_GPIO_OUTPUT  = 23;
const HIH6130_I2C_BUS  = 1;
const HIH6130_ADDRESS  = 0x27;
const HIH6130_CMD_READ = 0x04;

const DevicesBase = require('./devices-base.js');
const deviceUtils = require('./device-utils.js');

class DevicesRPi extends DevicesBase {

  constructor() {
    super();
    console.log('Creating DevicesRPi');

    let i2c  = require('i2c-bus');
    let Gpio = require('onoff').Gpio;

    this.i2cBus = i2c.openSync(HIH6130_I2C_BUS);
    this.led = new Gpio(LED_GPIO_OUTPUT, 'out'); // Pin 16 on the header (GPIO23)
  }

  LEDOn(callback) {
    console.log("DevicesRPi.LEDOn()");
    this.led.write(1, function(err) {
      callback(err);
    });
  }

  LEDOff(callback) {
    console.log("DevicesRPi.LEDOff()");
    this.led.write(0, function(err) {
      callback(err);
    });
  }

  ReadSensors(callback) {
    console.log("DevicesRPi.ReadSensors()");

    this.i2cBus.readI2cBlock(HIH6130_ADDRESS, HIH6130_CMD_READ, 4, new Buffer(4), function (err, bytesRead, data)
    {
      console.log('DevicesRPi.ReadSensors() read', bytesRead , 'bytes:', data, 'Error: ', err ? err : 'None');

      /*
        data[0] // humidity high byte
        data[1] // humidity low byte
        data[2] // temperature high byte
        data[3] // temperature low byte
      */

      var status   = (data[0] & 0xc0) >> 6;
      var humidity = (((data[0] & 0x3f) << 8) + data[1]) / 0x3fff * 100;
      var tempC    = (((data[2] << 8) + data[3]) >> 2) / 0x3fff * 165 - 40;
      var tempF    = deviceUtils.celsiusToFahrenheit(tempC); 

      var data = {
        status    : status,
        humidity  : humidity.toFixed(2),
        tempC     : tempC.toFixed(2),
        tempF     : tempF.toFixed(2),
        altitude  : -1,
        barometer : -1
      };

      callback(data);
    });
  }
}

module.exports = DevicesRPi;