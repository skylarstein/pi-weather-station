/*
  sensor-data.js

  SensorData schema for persisted historical data.
*/

'use strict';

const mongoose = require('mongoose');

const sensorDataSchema = mongoose.Schema(
{
  deviceId     : { type : String },
  timestamp    : { type : Date, default : undefined },
  temperatureC : { type : Number, default : 0 },
  humidity     : { type : Number, default : 0 },
  pressureinHg : { type : Number, default : 0 },
  lux          : { type : Number, default : 0 },
},
{
  collection : 'sensorData'
});

module.exports = mongoose.model('SensorData', sensorDataSchema);
