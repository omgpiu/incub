import App from './app';
import {
  AuthMiddlewareService,
  ExceptionFilter,
  IExceptionFilter,
  ILogger,
  LoggerService,
  MongoDBClient,
  TYPES,
} from './common';

import { IUtilsController, UtilsController } from './utils';
import { Container, ContainerModule, interfaces } from 'inversify';
import { Express } from 'express';
import { IMiddleware } from './common/interfaces';
import { blogBindings } from './blogs';
import { postBindings } from './posts';

export interface IBootstrapReturn {
  appContainer: Container;
  app: App;
  express: Express;
}

export const commonBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService);
  bind<IUtilsController>(TYPES.UtilsController).to(UtilsController);
  bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
  bind<IMiddleware>(TYPES.AuthMiddlewareService).to(AuthMiddlewareService);
  bind<MongoDBClient>(TYPES.MongoDBClient).to(MongoDBClient).inSingletonScope();
  bind<App>(TYPES.Application).to(App);
});

export async function bootstrap(port?: number): Promise<IBootstrapReturn> {
  const appContainer = new Container();
  appContainer.load(blogBindings);
  appContainer.load(postBindings);
  appContainer.load(commonBindings);

  const app = appContainer.get<App>(TYPES.Application);

  await app.start(port);

  return { appContainer, app, express: app.app };
}

export const boot = bootstrap();
