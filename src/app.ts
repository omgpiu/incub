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
import { LoggerService } from './logger/logger';
import { ExeptionFilter } from './error/exeption.filter';
import { VideoController } from './video/video.controller';
import { homeRouter } from './routes';
import { testRouter } from './routes/test';

export class App {
  app: Express;
  server: Server;
  port: number;
  logger: LoggerService;
  videoController: VideoController;
  exceptionFilter: ExeptionFilter;

  constructor(
    logger: LoggerService,
    videoController: VideoController,
    exeptionFilter: ExeptionFilter,
  ) {
    this.app = express();
    this.port = this.normalizePort(process.env.PORT || 3000);
    this.logger = logger;
    this.videoController = videoController;
    this.exceptionFilter = exeptionFilter;
  }

  private normalizePort(val: string | number): number {
    const port = parseInt(val as string, 10);

    if (isNaN(port) || port < 0) {
      throw new Error(`Invalid port: ${val}`);
    }

    return port;
  }

  useRoutes() {
    this.app.use('/', homeRouter);
    this.app.use('/testing/all-data', testRouter);
    this.app.use('/videos', this.videoController.router);
  }

  useExeptionFilters() {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  errorHandler: ErrorRequestHandler = (err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  };

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
    this.useExeptionFilters();
    this.app.use(this.errorHandler);
    this.server = this.app.listen(this.port, () => {
      this.logger.log(`Server running at http://localhost:${this.port}/`);
    });
  }
}
