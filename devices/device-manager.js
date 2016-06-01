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

  static instance() { // singleton instance
    const DeviceManagerSingletonSymbol = Symbol.for("app.weather-station.device-manager");
    return Object.getOwnPropertySymbols(global).indexOf(DeviceManagerSingletonSymbol) >= 0 ?
      global[DeviceManagerSingletonSymbol] : (global[DeviceManagerSingletonSymbol] = new DeviceManager());
  }

  constructor() {
    // Would ideally have a private constructor. Users should not instantiate this
    // class directly, but should instead call DevicemManager.instance() for the singleton.
    //
    console.log('Creating DeviceManager');

    if(deviceUtils.isRaspberryPi()) {
      const DevicesRPi = require('./devices-rpi.js');
      this.devices = new DevicesRPi();
    }
    else {
      const DevicesSimulated = require('./devices-simulated.js');
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

  locationDetails() {
    return this.devices.locationDetails(); // returns Promise
  }      

}

module.exports = DeviceManager;
