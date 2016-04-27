/*
  device-manager.js

  DeviceManager provides a platform-independent interface to our hardware devices
  so we can build and run this application on different platforms.

  Additional device/platform configuration options could certainly be supported
  here (via constructor args or a config file), but not today.
*/

"use strict";

const deviceUtils = require('./device-utils.js');

// DeviceManager constructor
//
function DeviceManager() {

  if(deviceUtils.isRaspberryPi()) {
    let DevicesRPi = require('./devices-rpi.js');
    this.devices = new DevicesRPi();
  }
  else {
    let DevicesSimulated = require('./devices-simulated.js');
    this.devices = new DevicesSimulated();    
  }
}

// DeviceManager functions
//
DeviceManager.prototype.LEDOn = function(callback) {
  this.devices.LEDOn(callback);
}

DeviceManager.prototype.LEDOff = function(callback) {
  this.devices.LEDOff(callback);
}

DeviceManager.prototype.ReadSensors = function(callback) {
  return this.devices.ReadSensors(callback);
}

module.exports = DeviceManager;
