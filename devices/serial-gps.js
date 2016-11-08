/*
  serial-gps.js

  Super bare bones GPS driver.
*/

'use strict';

class SerialGPS {

  constructor(port, baud) {
    const SerialPort = require('serialport');
    const nmea = require('nmea');

    this.serialPort = new SerialPort(port ? port : '/dev/ttyAMA0', {
      baudrate : baud ? baud : 9600,
      parser   : SerialPort.parsers.readline('\r\n'),
      autoOpen : false
    });

    this.data = {};

    this.serialPort.open((err) => {
      if(err) {
        console.error(`Failed to open GPS port: ${err.message}`);
      }
      else {
        console.log(`Opened GPS port '${this.serialPort.path}' at ${this.serialPort.options.baudRate} baud`);
      }
    });

    this.serialPort.on('data', (line) => {
      let sentence = {};
      try {
        sentence = nmea.parse(line);
      }
      catch(err){
        // TODO: UART may never sync on bad startup condition, should close and re-open port!
        return console.error('Invalid or impartial NMEA sentence, probably due to startup condition. Will try the next one...');
      }

      switch(sentence.sentence) {

        case 'GGA':
          let locGGA = this.gpsToDegrees(sentence.lat, sentence.latPole, sentence.lon, sentence.lonPole);
          this.data['lat']           = locGGA.lat;
          this.data['lon']           = locGGA.lon;
          this.data['altitude']      = sentence.alt;
          this.data['altitudeUnits'] = sentence.altUnit;
          break;

        case 'RMC':
          let locRMC = this.gpsToDegrees(sentence.lat, sentence.latPole, sentence.lon, sentence.lonPole);
          this.data['lat']        = locRMC.lat;
          this.data['lon']        = locRMC.lon;
          this.data['timestamp']  = this.gpsToUTC(sentence.timestamp, sentence.date);
          this.data['speedKnots'] = sentence.speedKnots;
          this.data['heading']    = sentence.trackTrue;
          break;
  
        case 'GSA':
          this.data['satelliteCount'] = sentence.satellites.length;
          this.data['PDOP']           = parseFloat(sentence.PDOP);
          this.data['HDOP']           = parseFloat(sentence.HDOP);
          this.data['VDOP']           = parseFloat(sentence.VDOP);

          switch(sentence.mode) {
            case 1:
              this.data['fix'] = 'No Fix';
              break;

            case 2:
              this.data['fix'] = '2D Fix';
              break;

            case 3:
              this.data['fix'] = '3D Fix';
              break;

            default:
              this.data['fix'] = `Unknown (${sentence.mode})`;
          }

          break;
      }
    });
  }

  getData() {
    return this.data;
  }

  gpsToUTC(timestamp, date) {
    // Expecting timestamp HHMMSS, date DDMMYY
    //
    let hours   = timestamp.substring(0, 2);
    let minutes = timestamp.substring(2, 4);
    let seconds = timestamp.substring(4, 6);
    let day     = date.substring(0, 2);
    let month   = date.substring(2, 4);
    let year    = `20${date.substring(4, 6)}`; // TODO: Fix this bug in 84 years

    return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
  }

  gpsToDegrees(lat, latPole, lon, lonPole) {
    // Expecting DDMM.MMMM
    //
    let latDegrees = lat.substring(0, 2);
    let latMinutes = lat.substring(2, 9);
    let lonDegrees = lon.substring(0, 3);
    let lonMinutes = lon.substring(3, 11);

    let latitude = parseInt(latDegrees) + (parseFloat(latMinutes) / 60);
    let longitude = parseInt(lonDegrees) + (parseFloat(lonMinutes) / 60);

    if(latPole.toUpperCase() === 'S') {
      latitude *= -1;
    }

    if(lonPole.toUpperCase() === 'W') {
      longitude *= -1;
    }

    return { lat : latitude, lon : longitude };
  }
}

module.exports = SerialGPS;
