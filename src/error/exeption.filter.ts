import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../logger/logger';
import { IExeptionFilter } from './exeption.filter.interface';
import { HttpError } from './http-error.class';

export class ExeptionFilter implements IExeptionFilter {
  logger: LoggerService;

  constructor(logger: LoggerService) {
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
