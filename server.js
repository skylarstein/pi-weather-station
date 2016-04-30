/*
  server.js

  The HTTP server for our Raspberry Pi Weather Station
*/

'use strict';

const app        = require('./app.js');
const os         = require('os');
const http       = require('http');
const appPackage = require('./package.json');

// Start our server
//
const httpServer = http.createServer(app).listen(process.env.PORT || 8888);

httpServer.on('listening', () => {
  console.log(`Welcome to ${appPackage.description} v${appPackage.version}`);
  console.log(`Node ${process.version}, ${os.platform()}/${os.arch()}`);
  console.log(`HTTP server listening on port ${httpServer.address().port} on ${os.hostname()}`);
});

// Clean shutdown
//
process.on('SIGTERM', () => cleanShutdown('SIGTERM'));
process.on('SIGINT', () => cleanShutdown('SIGINT'));

const cleanShutdown = shutdownType => {
  console.log(`[${shutdownType}] Initiating graceful shutdown...`);

  httpServer.close(() => {
    console.log('HTTP server closed remaining connections. Exiting now.');
    process.exit(0);
  });
}
