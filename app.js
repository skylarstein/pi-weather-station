var express = require("express");
var app     = express();
var Gpio    = require('onoff').Gpio;
var led     = new Gpio(23, 'out'); // Pin 16 on the header (GPIO23)

var i2c             = require('i2c');
var HIH6130_Address = 0x27;
var wire            = new i2c(HIH6130_Address, { device: '/dev/i2c-1' });  // point to your i2c address, debug provides REPL interface 

function led_on() {
  led.writeSync(1);
  console.log("led_on");
}

function led_off() {
  led.writeSync(0);
  console.log("led_off");
}

app.get("/", function (req, res) {
  res.send("Welcome to the Raspberry Pi Weather Station!");
});

app.get("/on", function (req, res) {
  led_on();
  res.send("ON");
});

app.get("/off", function (req, res) {
  led_off();
  res.send("OFF");
});

app.get("/sensor", function (req, res) {
	wire.readBytes(4, 4, function(err, data) {
		console.log('Got raw data:', data.toString('hex'));

		var hum_hi  = data[0];
		var hum_lo  = data[1];
		var temp_hi = data[2];
		var temp_lo = data[3];

		var status    = (data[0] & 0xc0) >> 6;
		var humidity  = ((data[0] & 0x3f) * 256 + data[1]) / 0x3fff * 100;
		var tempC     = ((data[2] *256 + data[3]) >> 2) / 0x3fff * 165 - 40;
		var tempF     = tempC * 9 / 5 + 32; 

		var result = {
			status   : status,
	  	humidity : humidity.toFixed(2),
	 	  tempC    : tempC.toFixed(2),
		  tempF    : tempF.toFixed(2)
		};

	 	res.send(JSON.stringify(result));
	});
});

module.exports = app;
