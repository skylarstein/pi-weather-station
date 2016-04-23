var express = require("express");
var app     = express();
var Gpio    = require('onoff').Gpio;
var led     = new Gpio(23, 'out'); // Pin 16 on the header (GPIO23)

function led_on() {
  led.writeSync(1);
  console.log("led_on");
}

function led_off() {
  led.writeSync(0);
  console.log("led_off");
}

app.get("/", function (req, res) {
  res.send("Welcome to the Raspberry Pi Weather Station");
});

app.get("/on", function (req, res) {
  led_on();
  res.send("ON");
});

app.get("/off", function (req, res) {
  led_off();
  res.send("OFF");
});

module.exports = app;
