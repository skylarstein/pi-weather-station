/*
  devices-base.js

  Base class for our device interface implementations.
*/

'use strict';

class DevicesBase {

  constructor() {
  }

  ledOn() {
    throw new Error('Derived class has not implemented LEDOn()'); // Derived class should return a Promise
  }

  ledOff() {
    throw new Error('Derived class has not implemented LEDOff()'); // Derived class should return a Promise
  }

  readSensors() {
    throw new Error('Derived class has not implemented ReadSensors()'); // Derived class should return a Promise
  }
}

module.exports = DevicesBase;
