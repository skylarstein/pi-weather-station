/*
  publisher.js

  DatabasePublisher persists sensor data for historical views.
*/

'use strict';

const _          = require('lodash');
const mongoose   = require('mongoose');
const SensorData = require('../model/sensor-data.js');

class DatabasePublisher {

  // instance() - create a singleton instance of Publisher
  //
  static instance() {
    const PublisherSingletonSymbol = Symbol.for('app.pi-weather-station.database-publisher');
    return Object.getOwnPropertySymbols(global).indexOf(PublisherSingletonSymbol) >= 0 ?
      global[PublisherSingletonSymbol] : (global[PublisherSingletonSymbol] = new DatabasePublisher());
  }

  // constructor() - Would ideally have a private constructor. Users should not instantiate
  // this class directly, but should instead call Publisher.instance() for the singleton.
  //
  constructor() {
    console.log('Creating DatabasePublisher');

    this.deviceManager = require('../devices/device-manager.js').instance();
    this.publishRateMs = Number(process.env.DATABASE_SENSOR_DATA_RATE_MS);
    this.deviceId      = process.env.PI_WEATHER_STATION_DEVICE_ID;
  }

  // startPublishing() - fire up the publisher and persist sensor data snapshots to the DB
  // at the configured interval.
  //
  startPublishing() {

    if(!this.deviceId) {
      console.error('Unknown device id, DatabasePublisher will not start!');
      return;
    }

    if(!this.publishRateMs || isNaN(this.publishRateMs) || this.publishRateMs <= 0) {
      console.error(`DatabasePublisher update rate is not valid [${this.publishRateMs}], will not start!`);
      return;
    }

    console.log(`DatabasePublisher starting with update rate ${this.publishRateMs}ms`);

    this.publishEnabled = true;
    this._restartPublishTimer();
  }

  // stopPublisher()
  //
  stopPublishing() {
    console.log('DatabasePublisher: stop publishing');
    clearTimeout(this.timeoutId);
    this.publishEnabled = false;
  }

  // _restartPublishTimer() - internal method to restart our publishing timer
  //
  _restartPublishTimer() {
    if(this.publishEnabled) {
      this.timeoutId = setTimeout(() => this._publish(), this.publishRateMs);
    }
  }

  // _publish() - internal method to read sensor data, persist to DB
  // 
  _publish() {

    if(mongoose.connection.readyState != 1 /*connected*/) {
      console.log(`I'd really love to publish some sensor data but the DB is not in a connected state! I'll try next time.`);
      this._restartPublishTimer();
      return;
    }

    this.deviceManager.readSensors()
      .then((data) => {
        const sensorData = new SensorData();

        sensorData.deviceId     = this.deviceId;
        sensorData.timestamp    = _.get(data, 'GPS.timestamp', undefined);
        sensorData.temperatureC = _.get(data, 'DHT22.temperature_C', 0);
        sensorData.humidity     = _.get(data, 'DHT22.humidity', 0);
        sensorData.pressureinHg = _.get(data, 'BME280.pressure_inHg', 0);
        sensorData.lux          = _.get(data, 'TSL2561.lux', 0);

        sensorData.save((err, obj, numAffected) => {
          if(err) {
            console.error(`Failed to save SensorData! Error: ${err}`);
          }
          else {
            console.log(`Saved ${JSON.stringify(sensorData, null, 2)}`);
          }

          this._restartPublishTimer();
        });
      })
      .catch((err) => {
        console.error(`Unable to publish sensor data, DeviceManager.readSensors() error: ${err}`);
        this._restartPublishTimer();
      });
  }
}

module.exports = DatabasePublisher;
