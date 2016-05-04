/*
  devices-rpi.js

  A direct hardware interface to our Rasbperry Pi devices.
*/

'use strict';

const LED_GPIO_OUTPUT = 23;
const HIH6130_I2C_BUS = 1;

const DevicesBase = require('./devices-base.js');
const deviceUtils = require('./device-utils.js');

class DevicesRPi extends DevicesBase {

  constructor() {
    super();
    console.log('Creating DevicesRPi');

    let Gpio = require('onoff').Gpio;
    let HIH6130 = require('./HIH6130.js');

    this.led = new Gpio(LED_GPIO_OUTPUT, 'out'); // Pin 16 on the header (GPIO23)
    this.hih6130 = new HIH6130(HIH6130_I2C_BUS);
  }

  ledOn() {
    console.log('DevicesRPi.LEDOn()');
    const led = this.led;
    return new Promise((resolve, reject) => led.write(1, err => err ? reject(err) : resolve('OK')));
  }

  ledOff() {
    console.log('DevicesRPi.LEDOff()');
    const led = this.led;
    return new Promise((resolve, reject) => led.write(0, err => err ? reject(err) : resolve('OK')));
  }

  readSensors() {
    console.log('DevicesRPi.ReadSensors()');
    const hih6130 = this.hih6130;
    return new Promise((resolve, reject) => {
      hih6130.readData()
        .then(data => resolve({
            status   : data.status,
            humidity : data.humidity.toFixed(2),
            tempC    : data.tempC.toFixed(2),
            tempF    : deviceUtils.celsiusToFahrenheit(data.tempC).toFixed(2),
            raw      : data.raw
          }))
         .catch(err => reject(err));
    });
  }

}

module.exports = DevicesRPi;
