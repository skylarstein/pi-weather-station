/*
  device-utils.js

*/

"use strict";

const os = require('os');

exports.isRaspberryPi = function isRaspberryPi() {

  // This isn't actually identifying the Raspberry Pi specifically but it does the job for now.
  //
  return os.type() === 'Linux';
};

exports.celsiusToFahrenheit = function celsiusToFahrenheit(c) {
  return c * 9 / 5 + 32
};
