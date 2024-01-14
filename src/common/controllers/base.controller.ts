import { Response, Router, Request } from 'express';
import { ILogger } from '../logger';
import { IControllerRoute } from '../interfaces';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { BasePramPayload } from '../types';
import { ObjectId } from 'mongodb';

@injectable()
export abstract class BaseController {
  private readonly _router: Router;

  constructor(private logger: ILogger) {
    this._router = Router();
  }

  protected bindRoutes(routes: IControllerRoute[]) {
    for (const route of routes) {
      this.logger.log(`Binding route [${route.method}] to [${route.path}]`);

      const middleware = route.middlewares?.map((m) => m.execute.bind(m));
      const handler = route.func.bind(this);
      const pipeline = middleware ? [...middleware, handler] : handler;
      this._router[route.method](route.path, pipeline);
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
  protected async handleWithId<T, P extends BasePramPayload, B, Q>(
    req: Request<P, object, B, Q>,
    res: Response,
    callback: (id: ObjectId) => Promise<T | null>,
    options: {
      code?: number;
      entity?: 'Video' | 'Blog' | 'Post';
    },
  ): Promise<void> {
    const id = req.params.id;
    const notFoundMessage = `${options.entity} not found`;
    if (!id || !ObjectId.isValid(id)) {
      res.status(404).json({ message: notFoundMessage });
      return;
    }

    try {
      const result = await callback(id);
      if (result) {
        res.status(options.code ?? 200).json(result);
      } else if (options.code === 204 && result) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: notFoundMessage });
      }
    } catch (error) {
      res.status(400).json({ message: 'Some error occurred' });
    }
  }
}
