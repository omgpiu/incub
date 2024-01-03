#!/usr/bin/env node

/**
 * Module dependencies.
 */

import http from 'http';
import debugModule from 'debug';
import { bootstrap } from '../src/main';
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
