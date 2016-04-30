/*
  device-utils.js

*/

'use strict';

const os = require('os');

// This isn't actually identifying the Raspberry Pi specifically but it does the job for now.
//
exports.isRaspberryPi = () => (os.type() === 'Linux');

exports.celsiusToFahrenheit = c => (c * 9 / 5 + 32);
