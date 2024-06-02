import { Request, Response, Router } from 'express';
import { ILogger } from '../logger';
import { IControllerRoute } from '../interfaces';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { BaseParamPayload } from '../types';
import { ObjectId } from 'mongodb';

type Entity = 'Video' | 'Blog' | 'Post';

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

  private getNotFoundMessage = (entity?: Entity) => {
    return `${entity ?? 'Entity'} not found`;
  };
  private makeRequest = async <T>(
    res: Response,
    idValue: string | ObjectId,
    callback: (id: ObjectId) => Promise<T | null>,
    errorMessage: string,
    isInternalRequest?: boolean,
    code?: number,
  ) => {
    try {
      const id = new ObjectId(idValue);
      const result = await callback(id);

      if (result) {
        if (isInternalRequest) {
          return result;
        } else {
          res
            .status(code ?? 200)
            .json(result)
            .end();
        }
      } else if (code === 204 && result) {
        res.sendStatus(204).end();
      } else {
        res.status(404).json({ message: errorMessage }).end();
      }
    } catch (error) {
      res.status(400).json({ message: 'Some error occurred' }).end();
    }
  };

  get router(): Router {
    return this._router;
  }

  protected async requestWithId<T, P extends BaseParamPayload, B, Q>(
    req: Request<P, object, B, Q>,
    res: Response,
    callback: (id: ObjectId) => Promise<T | null>,
    options: {
      code?: number;
      entity?: Entity;
      idKey?: string;
      isInternalRequest?: boolean;
      id?: ObjectId;
    },
  ) {
    let idValue;
    const notFoundMessage = this.getNotFoundMessage(options.entity);

    if (options.id) {
      return await this.makeRequest(
        res,
        options.id,
        callback,
        notFoundMessage,
        options.isInternalRequest ?? false,
        options.code,
      );
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (options.idKey && req.body[options.idKey]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      idValue = req.body[options.idKey];
    } else {
      idValue = req.params.id;
    }

    if (!idValue || typeof idValue !== 'string' || !ObjectId.isValid(idValue)) {
      res.status(404).json({ message: notFoundMessage }).end();
      return;
    }

    return await this.makeRequest(
      res,
      idValue,
      callback,
      notFoundMessage,
      options.isInternalRequest ?? false,
      options.code,
    );
  }
}
