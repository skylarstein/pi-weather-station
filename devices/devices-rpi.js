/*
  devices-rpi.js

  Direct interface to our RasbperryPi devices.
*/

"use strict";

const LED_GPIO_OUTPUT  = 23;
const HIH6130_ADDRESS  = 0x27;
const HIH6130_CMD_READ = 0x04;

const deviceUtils = require('./device-utils.js');
const i2c         = require('i2c-bus');
const i2c1        = i2c.openSync(1);
const Gpio        = require('onoff').Gpio;

const led  = new Gpio(LED_GPIO_OUTPUT, 'out'); // Pin 16 on the header (GPIO23)

// DevicesRPi constructor
//
function DevicesRPi() {
  console.log('Creating DevicesRPi');
}

// DevicesRPi functions
//
DevicesRPi.prototype.LEDOn = function(callback) {
  console.log("DevicesRPi.LEDOn()");
  led.write(1, function(err) {
    callback(err);
  });
}

DevicesRPi.prototype.LEDOff = function(callback) {
  console.log("DevicesRPi.LEDOff()");
  led.write(0, function(err) {
    callback(err);
  });
}

DevicesRPi.prototype.ReadSensors = function(callback) {
  console.log("DevicesRPi.ReadSensors()");

  i2c1.readI2cBlock(HIH6130_ADDRESS, HIH6130_CMD_READ, 4, new Buffer(4), function (err, bytesRead, data)
  {
    console.log('DevicesRPi.ReadSensors() read', bytesRead , 'bytes:', data, 'Error: ', err ? err : 'None');

    var hum_hi  = data[0];
    var hum_lo  = data[1];
    var temp_hi = data[2];
    var temp_lo = data[3];

    var status   = (data[0] & 0xc0) >> 6;
    var humidity = ((data[0] & 0x3f) * 256 + data[1]) / 0x3fff * 100;
    var tempC    = ((data[2] *256 + data[3]) >> 2) / 0x3fff * 165 - 40;
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

module.exports = DevicesRPi;
