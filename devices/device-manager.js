/*
  device-manager.js

  DeviceManager provides a platform-independent interface to our hardware devices
  so we can build and run this application on different platforms.

  Additional device/platform configuration options could certainly be supported
  here (via constructor args or a config file), but not today.
*/

'use strict';

const deviceUtils = require('./device-utils.js');

class DeviceManager {

  constructor() {
    console.log('Creating DeviceManager');

    if(deviceUtils.isRaspberryPi()) {
      let DevicesRPi = require('./devices-rpi.js');
      this.devices = new DevicesRPi();
    }
    else {
      let DevicesSimulated = require('./devices-simulated.js');
      this.devices = new DevicesSimulated();    
    }
  }

  ledOn() {
    return this.devices.ledOn(); // returns Promise
  }

  ledOff() {
    return this.devices.ledOff(); // returns Promise
  }

  readSensors() {
    return this.devices.readSensors(); // returns Promise
  }      

}

module.exports = DeviceManager;
