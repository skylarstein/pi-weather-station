# weather-station

Well need some setup instructions for a fresh Raspberry Pi. Super rough notes for now.

## Configure I2C

https://learn.adafruit.com/adafruits-raspberry-pi-lesson-4-gpio-setup/configuring-i2c

## Install Node.js

Currently targeting NodeJS v4.4.3 LTS

## Install gcc/g++ 4.8
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