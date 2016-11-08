/*
  devices-simulated.js

  A simulated interface to our devices so we can run this application on any platform.
*/

'use strict';

const DevicesBase = require('./devices-base.js');
const os          = require('os');

class DevicesSimulated extends DevicesBase {

  constructor() {
    super();
    console.log('Creating DevicesSimulated');
  }

  ledOn() {
    console.log('DevicesSimulated.ledOn()');
    return new Promise((resolve, reject) => resolve('OK'));
  }

  ledOff() {
    console.log('DevicesSimulated.ledOff()');
    return new Promise((resolve, reject) => resolve('OK'));
  }

  readSensors() {
    console.log('DevicesSimulated.readSensors()');

    // Including a little bit of movement in the fake data to illustrate live updates on the front end
    //
    return new Promise((resolve, reject) => {
      let c1 = 15 + (new Date()).getSeconds() / 60 * 15;
      let c2 = 15 + (new Date()).getSeconds() / 60 * 15;
      let fakeData = {
        simulated : true,
        DHT22 : {
          temperature_C : c1,
          temperature_F : c1 * 9 / 5 + 32,
          humidity : 39.7666
        },
        BME280 : {
          temperature_C : c2,
          temperature_F : c2 * 9 / 5 + 32,
          humidity : 39.7666,
          pressure_hPa : 1014.3578,
          pressure_inHg : 29.9539,
          altitude_m :  9.2139,
          altitude_ft : 30.2295
        },
        TSL2561 : {
          lux : 3000 + 250 * Math.random(),
          timestamp : '2016-10-09T23:41:15.107Z'
        },
        GPS : {
          lat : 37.444795 + Math.random() * 0.000001,
          lon : -122.165146 + Math.random() * 0.000001,
          altitude : 9.144 + Math.random() * 0.03,
          altitudeUnits : 'M',
          satelliteCount : 8,
          PDOP : 1.94,
          HDOP : 0.98,
          VDOP : 1.68,
          fix : '3D Fix',
          timestamp : new Date(),
          speedKnots : 0.01,
          heading : 227.16
        },
        app : {
          platformUptime : os.uptime(),
          processUptime  : process.uptime(),
          engine         : `Node.js ${process.version}`

        }
      };

      resolve(fakeData);
    });
  }

  locationDetails() {
    console.log('DevicesSimulated.locationDetails()');

    return new Promise((resolve, reject) => {
      let fakeData =  {
        timestamp : new Date(),
        solar : {
          sunrise : '2016-10-20T14:21:21.000Z',
          sunset : '2016-10-21T01:23:25.000Z'
        },
        location : {
          lat : '37.4448081',
          lon : '-122.165109168756',
          address : {
            house_number : '129',
            road : 'Lytton Avenue',
            neighbourhood : 'Downtown North',
            city : 'Palo Alto',
            county : 'Santa Clara County',
            state : 'California',
            postcode : '94301',
            country : 'United States of America',
            country_code : 'us'
          },
          boundingbox : [
            '37.4447023',
            '37.4449146',
            '-122.1652638',
            '-122.1649522'
          ]
        },
        timezone : {
          dstOffset : 3600,
          rawOffset : -28800,
          status : 'OK',
          timeZoneId : 'America/Los_Angeles',
          timeZoneName : 'Pacific Daylight Time'
        }
      };

      resolve(fakeData);
    });
  }
}

module.exports = DevicesSimulated;
