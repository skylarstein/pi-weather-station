/*
  publisher-ws.js

  WebSocketPublisher will publish sensor and location data to WebSocket clients.
*/

'use strict';

const _               = require('lodash');
const SensorData      = require('../model/sensor-data.js');
const WebSocketServer = require('ws').Server;

class WebSocketPublisher {

  // instance() - create a singleton instance of WebSocketPublisher
  //
  static instance() {
    const WebSocketPublisherSingletonSymbol = Symbol.for("app.pi-weather-station.websocket-publisher");
    return Object.getOwnPropertySymbols(global).indexOf(WebSocketPublisherSingletonSymbol) >= 0 ?
      global[WebSocketPublisherSingletonSymbol] : (global[WebSocketPublisherSingletonSymbol] = new WebSocketPublisher());
  }

  // constructor() - Would ideally have a private constructor. Users should not instantiate
  // this class directly, but should instead call WebSocketPublisher.instance() for the singleton.
  //
  constructor() {
    console.log('Creating WebSocketPublisher');

    this.deviceManager = require('../devices/device-manager.js').instance();
    this.sensorPublishRateMs = Number(process.env.WEBSOCKET_SENSOR_DATA_RATE_MS);
  }

  // startPublishing() - fire up WebSocketPublisher and push sensor updates to clients
  // at the configured interval.
  //
  startPublishing(httpServer) {

    if(!this.sensorPublishRateMs || isNaN(this.sensorPublishRateMs) || this.sensorPublishRateMs <= 0) {
      console.error(`WebSocketPublisher update rate is not valid [${this.sensorPublishRateMs}], will not start!`);
      return;
    }

    console.log(`WebSocketPublisher starting with update rate ${this.sensorPublishRateMs}ms`);

    this.wss = new WebSocketServer( { server: httpServer } );

    this.wss.on('connection', (ws) => {
      // Send immediate update upon initial connection
      //
      this._sendSensorData();
      this._sendLocationData();
    });

    this.sensorTimerId = setInterval(() => {
      this._sendSensorData();
    }, this.sensorPublishRateMs);

    this.locationTimerId = setInterval(() => {
      // Location data requests will hit third-party rate-limited reverse geocoding and timezone API.
      // I'll push these updates slower than local sensor data.
      //
      this._sendLocationData();
    }, 60000);
  }

  _sendSensorData() {
    if(this.wss.clients.length) {
      this.deviceManager.readSensors()
        .then((data) => {
          console.log(`Sending sensor data to ${this.wss.clients.length} websocket clients`);
          this.wss.clients.forEach((client) => {
            client.send(JSON.stringify({ id : 1, data : data }));
          });
        })
        .catch((err) => {
          console.error(`Unable to publish sensor data, DeviceManager.readSensors() error: ${error}`);
          this._restartPublishTimer();
        });
      }
  }

  _sendLocationData() {
    if(this.wss.clients.length) {
      this.deviceManager.locationDetails()
        .then((data) => {
          console.log(`Sending location data to ${this.wss.clients.length} websocket clients`);
          this.wss.clients.forEach((client) => {
            client.send(JSON.stringify({ id : 2, data : data }));
          });
        })
        .catch((err) => {
          console.error(`Unable to publish location data, DeviceManager.locationDetails() error: ${error}`);
          this._restartPublishTimer();
        });
      }
  }

  // stopPublisher()
  //
  stopPublishing() {
    console.log('WebSocketPublisher: stop publishing');
    clearTimeout(this.sensorTimerId);
    clearTimeout(this.locationTimerId);
    delete this.wss;
  }
}

module.exports = WebSocketPublisher;
