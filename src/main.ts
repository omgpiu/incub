import App from './app';
import {
  ExceptionFilter,
  IExceptionFilter,
  ILogger,
  LoggerService,
  TYPES,
} from './common';

import {
  IVideosController,
  IVideosService,
  VideosController,
  VideosService,
} from './videos';
import { IUtilsController, UtilsController } from './utils';
import { Container, ContainerModule, interfaces } from 'inversify';
import { Express } from 'express';

export interface IBootstrapReturn {
  appContainer: Container;
  app: App;
  express: Express;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService);
  bind<IVideosService>(TYPES.VideosService).to(VideosService);
  bind<IVideosController>(TYPES.VideosController).to(VideosController);
  bind<IUtilsController>(TYPES.UtilsController).to(UtilsController);
  bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
  bind<App>(TYPES.Application).to(App);
});

export async function bootstrap(port?: number): Promise<IBootstrapReturn> {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(TYPES.Application);
  await app.start(port);
  return { appContainer, app, express: app.app };
}

export const boot = bootstrap();
