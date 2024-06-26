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
import 'reflect-metadata';
import { IExceptionFilter, ILogger, MongoDBClient, TYPES } from './common';
import { UtilsController } from './utils';
import { inject, injectable } from 'inversify';
import { BlogsController } from './blogs';
import { PostsController } from './posts';
import dotenv from 'dotenv';
import { Routes } from './routes';

dotenv.config();
@injectable()
export default class App {
  app: Express;
  server: Server;
  port: number;

  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
    @inject(TYPES.UtilsController) private utilsController: UtilsController,
    @inject(TYPES.BlogsController) private blogsController: BlogsController,
    @inject(TYPES.PostsController) private postsController: PostsController,
    @inject(TYPES.MongoDBClient) private mongoDBClient: MongoDBClient,
  ) {
    this.app = express();
    this.port = this.normalizePort(process.env.PORT || 3000);
  }

  private normalizePort(val: string | number): number {
    const port = parseInt(val as string, 10);

    if (isNaN(port) || port < 0) {
      throw new Error(`Invalid port: ${val}`);
    }

    return port;
  }

  private useRoutes() {
    this.app.use(Routes.ROOT, this.utilsController.router);
    this.app.use(Routes.BLOGS, this.blogsController.router);
    this.app.use(Routes.POSTS, this.postsController.router);
  }

  private useExceptionFilters() {
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

  private errorHandler: ErrorRequestHandler = (err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
  };

  public async stop(): Promise<void> {
    if (this.server) {
      this.server.close();
    }
    await this.mongoDBClient.disconnect();
  }

  public async start(port: number = this.port) {
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
    this.server = this.app.listen(port, () => {
      this.loggerService.log(`Server running at http://localhost:${port}/`);
    });
    await this.mongoDBClient.connect();
  }
}
