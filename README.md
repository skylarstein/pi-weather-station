# Raspberry Pi Weather Station

Node.js spends so much of its time running inside virtualized instances, I figured it'd be fun to let it have its very own Raspberry Pi for an opportunity to talk directly to some hardware sensors. GPS, ambient temperature, ambient humidity, and barometric pressure. Includes some fun stuff like calculating the sunrise and sunset times at the reported GPS location, as well as support for publishing data to "the cloud" for real-time and historical data reporting.

Next on the list, a lux sensor, maybe a piezo buzzer because everyone needs a startup sound right? Also perhaps an integrated display or LCD. I imagine I'll just keep adding sensors until I run out of room on the prototype board.

## Currently Supported Hardware

* Foremost, I am running this project on a Raspberry Pi 2 Model B. I haven't yet tried this on a RPi 3 since the Adafruit GPS Hat I'm using is not compatible with that board. Hopefully that will change in the future.
*  [BME280  Barometric Pressure  Sensor](https://www.adafruit.com/product/2652) (I2C). Note that the BME280 reports temperature and humidity but these are on-chip measurements, not ambient!
*  [DHT22 Ambient Temperature and Humidity Sensor](https://www.adafruit.com/product/385) (Single pin digital signal, not 1-wire)
* Serial GPS via the [Adafruit Ultimated GPS Hat](https://www.adafruit.com/product/2324) 

## Device Software Setup

Installing Node.js is the first step, but there's a bit more to complete before jumping into 'npm install' and  'npm start'.

### 1. Install Node.js

At the time of this writing, all is well under Node 4.5.0 and 6.6.0.

### 2.  Configure I2C

https://learn.adafruit.com/adafruits-raspberry-pi-lesson-4-gpio-setup/configuring-i2c

### 3. Install gcc/g++ 4.8
```
  sudo apt-get update
  sudo apt-get install gcc-4.8 g++-4.8
  sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 20
  sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.8 50
  sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 20 --slave /usr/bin/g++ g++ /usr/bin/g++-4.6 
  sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.8 40 --slave /usr/bin/g++ g++ /usr/bin/g++-4.8 

  // select 4.8
  sudo update-alternatives --config gcc

  // confirm you have 4.8.x  
  g++ -v
  gcc -v
```
### 4. Install the Broadcom BCM2835 C Library
```
cd ~
wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.5.tar.gz
tar zxvf bcm2835-1.5.tar.gz
cd bcm2835-1.5
./configure
make
sudo make check
sudo make install
```
### 5. npm install

The takes several minutes on my RPi 2 Model B. Hang in there.

## Device Hardware Setup

Imaine an awesome image from http://fritzing.org right here.

## Running the Project

This Node.js project needs to talk directly to the hardware and requires access to /open/mem, /sys/class/gpio, and /dev/i2c. Because of this you will typically need run node with admin privileges.

```
sudo npm start
````

The default port is 8888. Specify your own via the PORT environment variable.


