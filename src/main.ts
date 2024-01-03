import { App } from './app';
import { LoggerService, ExceptionFilter } from './common';

import { VideosController } from './videos/videos.controller';
import { UtilsController } from './utils';

async function bootstrap(port?: number) {
  const logger = new LoggerService();
  const videosController = new VideosController(logger);
  const exceptionFilter = new ExceptionFilter(logger);
  const utilsController = new UtilsController(logger);

  const appInstance = new App(
    logger,
    videosController,
    exceptionFilter,
    utilsController,
    port,
  );

  await appInstance.start();

  return appInstance;
}

export default bootstrap;
