/*
  server.js
  The HTTP server for our Raspberry Pi Weather Station
*/

'use strict';

if(!require('dotenv').config({silent: true})) {
  //throw new Error('An .env file is required!');
}

const app                = require('./app.js');
const os                 = require('os');
const http               = require('http');
const appPackage         = require('./package.json');
const port               = process.env.PORT || 8888;
const WebSocketPublisher = require('./controllers/publisher-ws.js');

// Start our server
//
const httpServer = http.createServer(app).listen(port);

httpServer.on('listening', () => {
  console.log(`Welcome to ${appPackage.description} v${appPackage.version}`);
  console.log(`Node ${process.version}, ${os.platform()}/${os.arch()}`);

  const addr = httpServer.address();
  const bind = (typeof addr === 'string') ? 'pipe ' + addr : 'port ' + addr.port;

  console.log(`HTTP server listening on ${bind} on ${os.hostname()}`);

  WebSocketPublisher.instance().startPublishing(httpServer);
});

httpServer.on('error', (error) => {
  if(error.syscall !== 'listen') {
    throw error;
  }

  const bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;

  switch(error.code) {

    case 'EACCES':
      console.error(`Error: ${bind} requires elevated privileges`);
      process.exit(1);
      break;

    case 'EADDRINUSE':
      console.error(`Error: ${bind} is already in use`);
      process.exit(1);
      break;

    default:
      throw error;
  }
});

// Clean shutdown
//
process.on('SIGTERM', () => cleanShutdown('SIGTERM'));
process.on('SIGINT', () => cleanShutdown('SIGINT'));

const cleanShutdown = (shutdownType) => {
  console.log(`[${shutdownType}] Initiating graceful shutdown...`);

  // I ain't got time to wait, commenting this out but leaving it here for posterity.
  //
  /*
  httpServer.close(() => {
    console.log('HTTP server closed remaining connections. Exiting now.');
    process.exit(0);
  });
  */
  process.exit(0);
}

module.exports = app; // for testing
