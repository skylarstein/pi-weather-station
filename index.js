// Raspberry Pi Weather Station

var app     = require('./app');
var os      = require("os");
var http    = require("http");
var httpServer  = http.createServer(app)

// Start our server
//
httpServer.listen(process.env.PORT || 8080);
console.log("HTTP server listening on port " + httpServer.address().port + " on " + os.hostname());
