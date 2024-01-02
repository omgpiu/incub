import { Response, Router } from 'express';
import { IControllerRoute } from './route.interface.js';
import { LoggerService } from '../logger/logger';

export abstract class BaseController {
  private readonly _router: Router;

  constructor(private logger: LoggerService) {
    this._router = Router();
  }

  protected bindRoutes(routes: IControllerRoute[]) {
    for (const route of routes) {
      this.logger.log(`Binding route [${route.method}] to [${route.path}]`);
      this.router[route.method](route.path, route.func.bind(this));
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
}
