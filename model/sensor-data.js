/*
  sensor-data.js

  SensorData schema for persisted historical data.
*/

'use strict';

const mongoose = require('mongoose');

const sensorDataSchema = mongoose.Schema({
  deviceId     : { type : String, required : true },
  timestamp    : { type : Date, default : undefined, required : true },
  temperatureC : { type : Number, default : 0 },
  humidity     : { type : Number, default : 0 },
  pressureinHg : { type : Number, default : 0 },
  lux          : { type : Number, default : 0 },
},
{
  collection : 'sensorData'
});

// TTL defaults to 30 days unless you tell me differently
//
let ttl = parseInt(process.env.DATABASE_SENSOR_DATA_TTL_SECONDS);

if(!ttl) {
  ttl = 24 * 60 * 60 * 30; // 30 days in seconds
}

sensorDataSchema.index({ timestamp: 1 }, { expireAfterSeconds: ttl });

module.exports = mongoose.model('SensorData', sensorDataSchema);
