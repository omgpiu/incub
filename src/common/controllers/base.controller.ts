import { Request, Response, Router } from 'express';
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
      idKey?: string;
      isInternalRequest?: boolean;
    },
  ) {
    let idValue;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (options.idKey && req.body[options.idKey]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      idValue = req.body[options.idKey];
    } else {
      idValue = req.params.id;
    }

    const notFoundMessage = `${options.entity} not found`;

    if (!idValue || typeof idValue !== 'string' || !ObjectId.isValid(idValue)) {
      res.status(404).json({ message: notFoundMessage }).end();
      return;
    }

    try {
      const id = new ObjectId(idValue);
      const result = await callback(id);

      if (result) {
        if (options.isInternalRequest) {
          return result;
        } else {
          res.status(options.code ?? 200).json(result);
        }
      } else if (options.code === 204 && result) {
        res.sendStatus(204).end();
      } else {
        res.status(404).json({ message: notFoundMessage });
      }
    } catch (error) {
      res.status(400).json({ message: 'Some error occurred' });
    }
  }
}
