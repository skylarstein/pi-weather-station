/*
  devices-rpi.js

  A direct hardware interface to our Rasbperry Pi devices.
*/

'use strict';

const LED_GPIO_OUTPUT = 23;

const DevicesBase = require('./devices-base.js');
const deviceUtils = require('./device-utils.js');
const async       = require('async');
const Gpio        = require('onoff').Gpio;
const HIH6130     = require('./HIH6130.js');
const BME280      = require('./BME280.js');
const SerialGPS   = require('./serial-gps.js');

class DevicesRPi extends DevicesBase {

  constructor() {
    super();
    console.log('Creating DevicesRPi');

    this.led     = new Gpio(LED_GPIO_OUTPUT, 'out'); // Pin 16 on the header (GPIO23)
    this.hih6130 = new HIH6130();
    this.bme280  = new BME280();
    this.gps     = new SerialGPS('/dev/ttyAMA0', 9600);

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
    const gps    = this.gps;

    return new Promise((resolve, reject) => {
      async.parallel([
        callback => bme280.readSensorData()
          .then(data => {
            data['temperature_F'] = BME280.convertCelciusToFahrenheit(data.temperature_C);
            data['pressure_inHg'] = BME280.convertHectopascalToInchesOfMercury(data.pressure_hPa);

            data['heatIndex_C'] = BME280.calculateHeatIndexCelcius(data.temperature_C, data.humidity);
            data['heatIndex_F'] = BME280.convertCelciusToFahrenheit(data.heatIndex_C);

            data['dewPoint_C'] = BME280.calculateDewPointCelcius(data.temperature_C, data.humidity);
            data['dewPoint_F'] = BME280.convertCelciusToFahrenheit(data.dewPoint_C);

            data['altitude_m'] = BME280.calculateAltitudeMeters(data.pressure_hPa);
            data['altitude_ft'] = BME280.convertMetersToFeet(data.altitude_m);

            return callback(null, { BME280 : data });
          })
          .catch(err => callback(null, { BME280 : { err : err }})),

        callback => hih6130.readSensorData()
          .then(data => callback(null, { HIH6130 : data }))
          .catch(err => callback(null, { HIH6130 : { err : err }})),

        callback => callback(null, { GPS : gps.getData() })
      ],
      (err, results) => resolve(results));
    });
  }

}

module.exports = DevicesRPi;
