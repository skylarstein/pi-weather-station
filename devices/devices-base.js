/*
  devices-base.js

  Base class for our device interface implementations.
*/

'use strict';

class DevicesBase {

  constructor() {
  }

  ledOn() {
    throw new Error('Derived class has not implemented ledOn()'); // Derived class should return a Promise
  }

  ledOff() {
    throw new Error('Derived class has not implemented ledOff()'); // Derived class should return a Promise
  }

  readSensors() {
    throw new Error('Derived class has not implemented readSensors()'); // Derived class should return a Promise
  }

  locationDetails() {
    throw new Error('Derived class has not implemented locationDetails()'); // Derived class should return a Promise
  }
}

module.exports = DevicesBase;
