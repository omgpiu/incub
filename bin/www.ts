#!/usr/bin/env node

/**
 * Module dependencies.
 */

import http from 'http';
import debugModule from 'debug';
import bootstrap from '../src/main';
import { App } from '../src/app';

const debug = debugModule('incub:server');

bootstrap().then((appInstance: App) => {
  appInstance.server.on('error', (error: NodeJS.ErrnoException) =>
    onError(error, appInstance.port),
  );
  appInstance.server.on('listening', () => onListening(appInstance.server));

  function onError(error: NodeJS.ErrnoException, port: number | string): void {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  function onListening(server: http.Server): void {
    const addr = server.address();
    const bind =
      typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
    debug(`Listening on ${bind}`);
  }
});

// const debug = debugModule('incub:server');
//
// /**
//  * Get port from environment and store in Express.
//  */
// const port = normalizePort(process.env.PORT || '3000');
// app.set('port', port);
//
// /**
//  * Create HTTP server.
//  */
// const server = http.createServer(app);
//
// /**
//  * Listen on provided port, on all network interfaces.
//  */
// server.listen(port);
// server.on('error', onError);
// server.on('listening', onListening);
//
// /**
//  * Normalize a port into a number, string, or false.
//  */
// function normalizePort(val: string | number): number | string | boolean {
//   const port = parseInt(val as string, 10);
//
//   if (isNaN(port)) {
//     // named pipe
//     return val;
//   }
//
//   if (port >= 0) {
//     // port number
//     return port;
//   }
//
//   return false;
// }
//
// /**
//  * Event listener for HTTP server "error" event.
//  */
// function onError(error: NodeJS.ErrnoException): void {
//   if (error.syscall !== 'listen') {
//     throw error;
//   }
//
//   const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
//
//   // handle specific listen errors with friendly messages
//   switch (error.code) {
//     case 'EACCES':
//       console.error(`${bind} requires elevated privileges`);
//       process.exit(1);
//       break;
//     case 'EADDRINUSE':
//       console.error(`${bind} is already in use`);
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// }
//
// /**
//  * Event listener for HTTP server "listening" event.
//  */
// function onListening(): void {
//   const addr = server.address();
//   const bind =
//     typeof addr === 'string'
//       ? `pipe ${addr}`
//       : addr
//         ? `port ${addr.port}`
//         : 'unknown port';
//   debug(`Listening on ${bind}`);
// }
