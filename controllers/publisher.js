/*
  publisher.js

  Poll sensor data from DeviceManager, POST updates to the server.
*/

'use strict';

const _       = require('lodash');
const request = require('request');
const url     = require('url');

class Publisher {

  // instance() - create a singleton instance of Publisher
  //
  static instance() {
    const PublisherSingletonSymbol = Symbol.for("app.weather-station.publisher");
    return Object.getOwnPropertySymbols(global).indexOf(PublisherSingletonSymbol) >= 0 ?
      global[PublisherSingletonSymbol] : (global[PublisherSingletonSymbol] = new Publisher());
  }

  // constructor() - Would ideally have a private constructor. Users should not instantiate
  // this class directly, but should instead call Publisher.instance() for the singleton.
  //
  constructor() {
    console.log('Creating Publisher');
    const DeviceManager = require('../devices/device-manager.js');

    this.deviceManager  = DeviceManager.instance();
    this.publishEnabled = false;
    this.publishRateMs  = 5000; // TODO: Make this configurable some day
    this.publishUrl     = process.env.ZSTATION_SERVER_URL ? url.resolve(process.env.ZSTATION_SERVER_URL, 'device/update') : null;
  }

  startPublishing() {
    if(!this.publishUrl) {
      throw new Error('ZSTATION_SERVER_URL is not defined, Publisher will not start!');
      return;
    }

    console.log(`Device ${process.env.ZSTATION_DEVICE_ID} publishing to ${this.publishUrl} (${this.publishRateMs} ms)`);
    this.publishEnabled = true;
    this.publish();
  }

  stopPublishing() {
    this.publishEnabled = false;
  }

  publish() {
    this.deviceManager.readSensors()
      .then((data) => {
        var data = {
          temperature_C : _.get(data, 'BME280.temperature_C', 0),
          humidity      : _.get(data, 'BME280.humidity', 0),
          pressure_hPa  : _.get(data, 'BME280.pressure_hPa', 0),
          altitude_m    : _.get(data, 'GPS.altitude', 0),
          lat           : _.get(data, 'GPS.lat', 0),
          lon           : _.get(data, 'GPS.lon', 0),
          timestamp     : new Date()
        };

        request({
          method  : 'POST',
          url     : this.publishUrl,
          body    : JSON.stringify(data),
          headers : {
            'x-zstation-api-key'   : process.env.ZSTATION_API_KEY,
            'x-zstation-device-id' : process.env.ZSTATION_DEVICE_ID,
            'Content-Type'         : 'application/json' 
          }
        },
        (error, response, body) => {
          if(error || _.get(response, 'statusCode', 0) != 200) {
            console.log(`Failed to published update to ${this.publishUrl}, statusCode ${_.get(response, 'statusCode', 0)}, ${error}`);
          }
          else {
            console.log(`Published update to ${this.publishUrl}, statusCode ${_.get(response, 'statusCode', 0)}`);
          }
        });

        if(this.publishEnabled) {
          // Remember that arrow functions lexically bind 'this' so we're all good
          setTimeout(() => this.publish(), this.publishRateMs);
        }
      })
      .catch((err) => {
        console.error(`Unable to publish update to ${url}, DeviceManager.readSensors() error: ${error}`);
        setTimeout(() => this.publish(), this.publishRateMs);
      });
  }
}

module.exports = Publisher;
