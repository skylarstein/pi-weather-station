/*
  device-utils.js

*/

'use strict';

const _         = require('lodash');
const os        = require('os');
const request   = require('request');
const SolarCalc = require('solar-calc');
const fs        = require('fs');

// isRaspberryPi() - are we running on a Raspberry Pi?
//
exports.isRaspberryPi = () => {

  // If we have a BCMxxx ARM processor running Linux, I'll call it close enough for now.
  // This will of course trigger for other non-RPi Linux BCMxxxx boards. Maybe everything
  // would work just fine on those boards, but since I haven't tested on anything other
  // than an RPi I can't say for certain.
  //
  const info = exports.cpuinfo();

  const isBCM = info ? _.filter(info.Hardware, (val) => val.indexOf('BCM') !== -1).length : 0;
  const isARM = info ? _.filter(info.model_name, (val) => val.indexOf('ARMv') !== -1).length : 0;

  return (os.type() === 'Linux' && isBCM && isARM);
}

// cpuinfo() - return /proc/cpuinfo as an object
//
exports.cpuinfo = () => {
  const _cpuinfo = !fs.existsSync('/proc/cpuinfo') ? '' : fs.readFileSync('/proc/cpuinfo') + '';
  return _cpuinfo.split('\n').reduce((result, line) => {
    line = line.replace(/\t/g, '')
    let parts = line.split(':')
    let key = parts[0].replace(/\s/g, '_')
    if(parts.length === 2) {
      result[key] = parts[1].trim().split(' ')
    }
    return result
  }, {});
}

// flattenResults() - sensor results are generated via async.parallel with individual responses
// pacakged into an array. Flatten the array to make things easier for the client to digest.
/*
  Given: [{ sensor1 : { val1 : 1 }},
          { sensor2 : { val2 : 2 }},
          { sensor3 : { val3 : 3 }}]
  
  Return: { sensor1 : { val1 : 1 },
            sensor2 : { val2 : 2 },
            sensor3 : { val3 : 3 }}
*/

exports.flattenResults = (data) => {
  let results = {};
  if(_.isObject(data)) {
    for(var k of data) {
      let key = Object.keys(k)[0];
      results[key] = k[key];
    }
  }
  return results;
}

// reverseGeocode() - turn latitude/longitude into a human readable address / place name
//
exports.reverseGeocode = (gpsData) => {
  return new Promise((resolve, reject) => {
    //getJSON(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${gpsData.lat},${gpsData.lon}`)
    getJSON(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${gpsData.lat}&lon=${gpsData.lon}`)
      .then((data) => resolve({ address     : data.address,
                                lat         : data.lat,
                                lon         : data.lon,
                                boundingBox : data.boundingbox
                            }))
      .catch((err) => reject(err));
    });
}

// lookupTimezone() - determine the timezone at the given latitude/longitude
//
exports.lookupTimezone = (gpsData) => {
  return new Promise((resolve, reject) => {
    getJSON(`https://maps.googleapis.com/maps/api/timezone/json?location=${gpsData.lat},${gpsData.lon}&timestamp=${gpsData.timestamp.getTime()/1000}`)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
    });
}

// sunTimes() - get sunrise and sunset times for the given date and location
//
exports.suntimes = (gpsData) => {
  let solarCalc = new SolarCalc(gpsData.timestamp, gpsData.lat, gpsData.lon);
  return { sunrise : solarCalc.sunrise,
           sunset : solarCalc.sunset
         };
}

// getJSON() - wrapper around an HTTP GET request
//
const getJSON = (url) => {
  return new Promise((resolve, reject) => {
    request({
      method : 'GET',
      url : url,
      headers: {
        'User-Agent': 'node/request' // OpenStreetMap requires a user agent so I'll throw it in for all requests
      }
    },
    (error, response, body) => {
      try {
        resolve(JSON.parse(body));
      }
      catch(err) {
        reject({ jsonParserErr : err.toString() });
      }
    });
  });
}
