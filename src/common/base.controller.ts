import { NextFunction, Response, Request, Router } from 'express';
import { IControllerRoute } from './route.interface.js';
import { LoggerService } from '../logger/logger';
import {
  FieldValidationError,
  Result,
  ValidationChain,
  validationResult,
} from 'express-validator';
import { formatErrors } from '../helpers';

export abstract class BaseController {
  private readonly _router: Router;

  constructor(private logger: LoggerService) {
    this._router = Router();
  }

  protected bindRoutes(routes: IControllerRoute[]) {
    for (const route of routes) {
      this.logger.log(`Binding route [${route.method}] to [${route.path}]`);

      const middlewares = Array.isArray(route.middleware)
        ? route.middleware
        : [route.middleware];

      const boundMiddlewares = middlewares.map((middleware) =>
        middleware.bind(this),
      );

      // Применяем все middleware функции к маршруту
      this.router[route.method](route.path, ...boundMiddlewares);
    }
  }

  public created(res: Response) {
    res.status(201);
  }

  public send<T>(res: Response, code: number, message: T) {
    res.type('application/json');
    return res.status(code).json(message);
  }

  public ok<T>(res: Response, message: T) {
    return this.send<T>(res, 200, message);
  }

  get router(): Router {
    return this._router;
  }
  validate(rules: ValidationChain[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      await Promise.all(rules.map((validation) => validation.run(req)));

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        formatErrors(errors as Result<FieldValidationError>);
        res.status(400).json({ errors: formatErrors });
      }

      next();
    };
  }
}
