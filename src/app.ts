import createError from 'http-errors';
import express, {
  ErrorRequestHandler,
  Express,
  NextFunction,
  Request,
  Response,
} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { Server } from 'http';

import { ILogger, IExceptionFilter } from './common';
import { VideosController } from './videos/videos.controller';
import { UtilsController } from './utils';

export class App {
  app: Express;
  server: Server;
  port: number;
  logger: ILogger;
  videosController: VideosController;
  exceptionFilter: IExceptionFilter;
  utilsController: UtilsController;

  constructor(
    logger: ILogger,
    videosController: VideosController,
    exceptionFilter: IExceptionFilter,
    utilsController: UtilsController,
    port?: number,
  ) {
    this.app = express();
    this.port = this.normalizePort(port || process.env.PORT || 3000);
    this.logger = logger;
    this.videosController = videosController;
    this.exceptionFilter = exceptionFilter;
    this.utilsController = utilsController;
  }

  private normalizePort(val: string | number): number {
    const port = parseInt(val as string, 10);

    if (isNaN(port) || port < 0) {
      throw new Error(`Invalid port: ${val}`);
    }

    return port;
  }

  useRoutes() {
    this.app.use('/', this.utilsController.router);
    this.app.use('/videos', this.videosController.router);
  }

  useExceptionFilters() {
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        this.exceptionFilter.catch.bind(this.exceptionFilter)(
          err,
          req,
          res,
          next,
        );
      },
    );
  }

  errorHandler: ErrorRequestHandler = (err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

      res.status(err.status || 500);
    res.render('error');
  };
  public async stop(): Promise<void> {
    if (this.server) {
      this.server.close();
    }
  }
  public async start() {
    this.app.set('views', path.join(__dirname, '../views'));
    this.app.set('view engine', 'pug');

    this.app.use(logger('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, '../public')));
    this.useRoutes();
    this.app.use(function (req: Request, res: Response, next: NextFunction) {
      next(createError(404));
    });
    this.app.use(this.errorHandler);
    // this.useExceptionFilters();
    this.server = this.app.listen(this.port, () => {
      this.logger.log(`Server running at http://localhost:${this.port}/`);
    });
  }
}
