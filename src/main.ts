import { App } from './app';
import { LoggerService } from './logger/logger';

import { ExeptionFilter } from './error/exeption.filter';
import { VideoController } from './video/video.controller';

async function bootstrap(port?: number) {
  const logger = new LoggerService();
  const appInstance = new App(
    logger,
    new VideoController(logger),
    new ExeptionFilter(logger),
    port,
  );
  await appInstance.start();
  return appInstance;
}

export default bootstrap;
