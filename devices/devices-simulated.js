/*
  devices-simulated.js

  A simualted interface to our sensors so we can run this application on any platform.

*/

"use strict";

const deviceUtils = require('./device-utils.js');

// DevicesSimulated constructor
//
function DevicesSimulated() {
  console.log('Creating DevicesSimulated');
}

// DevicesSimulated functions
//
DevicesSimulated.prototype.LEDOn = function(callback) {
  console.log("DevicesSimulated.LEDOn()");
  callback();
}

DevicesSimulated.prototype.LEDOff = function(callback) {
  console.log("DevicesSimulated.LEDOff()");
  callback();
}

DevicesSimulated.prototype.ReadSensors = function(callback) {
  console.log("DevicesSimulated.ReadSensors()");

  // TODO: Can be fancier here. Maybe have temperature and humidity drift by time of day, etc.
  //
  let humidity  = 40.00 + Math.random();
  let tempC     = 24.00 + Math.random();
  let altitude  = 10.00;
  let barometer = 30.00;

  var result = {
    status    : 0,
    humidity  : humidity.toFixed(2),
    tempC     : tempC.toFixed(2),
    tempF     : deviceUtils.celsiusToFahrenheit(tempC).toFixed(2),
    altitude  : altitude,
    barometer : barometer
  };

  callback(result);
}

module.exports = DevicesSimulated;