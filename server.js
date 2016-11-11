/*
  server.js

  The Node.js HTTP server for our Raspberry Pi Weather Station
*/

'use strict';

if(!require('dotenv').config({silent: true})) {
  //throw new Error('An .env file is required!');
}

const WeatherStationApp  = require('./app.js');
const os                 = require('os');
const http               = require('http');
const appPackage         = require('./package.json');
const port               = process.env.PORT || 8888;
const WebSocketPublisher = require('./controllers/publisher-ws.js');

class WeatherStationServer {

  constructor() {
    this.app = new WeatherStationApp().express;

    this._initServer();
    this._startWebSocketPublisher();
    this._initCleanShutdownHandler();
  }

  // For the sake of clean code I'm not going out of my way to make these private
  // beyond suggesting that they are private with the underscore-prefix naming convention.
  //
  _initServer() {

    this.httpServer = http.createServer(this.app).listen(port);

    this.httpServer.on('listening', () => {
      console.log(`Welcome to ${appPackage.description} v${appPackage.version}`);
      console.log(`Node ${process.version}, ${os.platform()}/${os.arch()}`);

      const addr = this.httpServer.address();
      const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;

      console.log(`HTTP server listening on ${bind} on ${os.hostname()}`);

      this.httpServer.on('error', (error) => {
        if(error.syscall !== 'listen') {
          throw error;
        }

        const bind = (typeof port === 'string') ? `Pipe ${port}` : `Port ${port}`;

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

    });
  }

  _startWebSocketPublisher() {
    WebSocketPublisher.instance().startPublishing(this.httpServer);
  }

  _initCleanShutdownHandler() {
    const cleanShutdown = (shutdownType) => {
      console.log(`[${shutdownType}] Initiating clean shutdown...`);

      // We would actually want to destroy all current connections here, otherwise
      // httpServer.close() will be wait until all current clients disconnect.
      // Maybe later. In the meantime, commenting it out but leaving it here for posterity.
      //
      // Could be pedantic and also notify the app, cleanly shutdown DB connection, etc.
      //
      /*
      this.httpServer.close(() => {
        console.log('HTTP server closed remaining connections. Exiting now.');
        process.exit(0);
      });
      */

      process.exit(0);
    };

    process.on('SIGTERM', () => cleanShutdown('SIGTERM'));
    process.on('SIGINT', () => cleanShutdown('SIGINT'));
  }
}

module.exports = new WeatherStationServer().app; // exporting app for testing
