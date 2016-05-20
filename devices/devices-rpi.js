/*
  devices-rpi.js

  A direct hardware interface to our Rasbperry Pi devices.
*/

'use strict';

const LED_GPIO_OUTPUT = 23;
const HIH6130_I2C_BUS = 1;
const BME280_I2C_BUS = 1;

const DevicesBase = require('./devices-base.js');
const deviceUtils = require('./device-utils.js');
const async       = require('async');

class DevicesRPi extends DevicesBase {

  constructor() {
    super();
    console.log('Creating DevicesRPi');

    let Gpio    = require('onoff').Gpio;
    let HIH6130 = require('./HIH6130.js');
    let BME280  = require('./BME280.js');

    this.led     = new Gpio(LED_GPIO_OUTPUT, 'out'); // Pin 16 on the header (GPIO23)
    this.hih6130 = new HIH6130(HIH6130_I2C_BUS);
    this.bme280  = new BME280(BME280_I2C_BUS);

    this.bme280.init()
      .then(result => console.log('BME280 initialization succeeded'))
      .catch(err => console.error('BME280 initialization failed: ' + err));
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
    const bme280 = this.bme280;

    return new Promise((resolve, reject) => {
      async.parallel([
        callback => bme280.readSensorData()
          .then(data => callback(null, { BME280 : data }))
          .catch(err => callback(null, { BME280 : { err : err }})),

        callback => hih6130.readSensorData()
          .then(data => callback(null, { HIH6130 : data }))
          .catch(err => callback(null, { HIH6130 : { err : err }}))
      ],
      (err, results) => resolve(results));
    });
  }

}

module.exports = DevicesRPi;
