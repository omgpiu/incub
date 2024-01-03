import { App } from './app';
import { LoggerService, ExceptionFilter } from './common';

import { VideosController } from './videos';
import { UtilsController } from './utils';
import { VideosService } from './videos';

async function bootstrap(port?: number) {
  const logger = new LoggerService();
  const videosController = new VideosController(logger, new VideosService());
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
