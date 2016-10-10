/*
  DHT22.js

  An interface to the DHT22 ambient temperature and humidity sensor. Note that this sensor
  uses one digital pin but it is not 1-Wire compatible!
*/

'use strict';

class DHT22 {
  constructor(gpioNo) {
    this.gpioNo        = gpioNo;
    this.dht22         = require('dht-sensor');
    this.humidity      = 0;
    this.temperature_C = 0;

    // The DHT22 internal sample rate is 0.5 Hz so our internal polling worker will update at
    // 2000ms. Clients of this class may call readSensorData() as often as they like but the data
    // will only be 2000ms fresh at best.
    //
    this.pollingWorker(2000);
  }

  readSensorData() {
    return { temperature_C : this.temperature_C, humidity : this.humidity };
  }

  pollingWorker(ms) {
    let data = this.dht22.read(22, this.gpioNo);
    if(data.humidity == 0 && data.temperature == 0) {
      data = this.dht22.read(22, this.gpioNo);
    }
 
    if(data.humidity != 0 || data.temperature != 0) {
      this.humidity = data.humidity;
      this.temperature_C = data.temperature;
    }
   
    setTimeout(() => this.pollingWorker(ms), ms); 
  }
}

module.exports = DHT22;
