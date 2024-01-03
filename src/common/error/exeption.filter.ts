import { NextFunction, Request, Response } from 'express';
import { IExceptionFilter } from './exeption.filter.interface';
import { HttpError } from './http-error.class';
import { ILogger } from '../logger';

export class ExceptionFilter implements IExceptionFilter {
  logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  catch(
    error: Error | HttpError,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    if (error instanceof HttpError) {
      this.logger.error(
        `[${error.data}]:Error Code: ${error.statusCode}, Message: ${error.message}`,
      );
      res.status(error.statusCode).send({ message: error.message });
    } else {
      this.logger.error(`message: ${error.message}`);
      res.status(500).send({ message: error.message });
    }
    next();
  }
}
