/*
  devices-base.js

  Base class for our device interface implementations.
*/

"use strict";

class DevicesBase {

  constructor() {
  }

  LEDOn(callback) {
    throw new Error("Derived class has not implemented LEDOn()")
  }

  LEDOff(callback) {
    throw new Error("Derived class has not implemented LEDOff()")
  }

  ReadSensors(callback) {
    throw new Error("Derived class has not implemented ReadSensors()")
  }
}

module.exports = DevicesBase;