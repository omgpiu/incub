import { Request, Response } from 'express';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import {
  AuthMiddlewareService,
  BaseController,
  BasePramPayload,
  ILogger,
  RequestWithBody,
  RequestWithBodyParams,
  RequestWithQuery,
  SearchParams,
  TYPES,
  ValidateMiddleware,
} from '../../common';
import { baseValidation, getAllValidation } from '../validation';
import { type BlogDto } from '../dto';
import { IBlogsService } from '../service';
import { IBlogsController } from './blogs.controller.interface';

@injectable()
export class BlogsController
  extends BaseController
  implements IBlogsController
{
  constructor(
    @inject(TYPES.ILogger) loggerService: ILogger,
    @inject(TYPES.BlogsService) private blogsService: IBlogsService,
    @inject(TYPES.AuthMiddlewareService)
    private authService: AuthMiddlewareService,
  ) {
    super(loggerService);

    this.bindRoutes([
      {
        path: '/',
        func: this.getAll,
        method: 'get',
        middlewares: [new ValidateMiddleware(getAllValidation)],
      },
      {
        path: '/',
        func: this.create,
        method: 'post',
        middlewares: [this.authService, new ValidateMiddleware(baseValidation)],
      },
      { path: '/:id', func: this.getById, method: 'get' },
      {
        path: '/:id',
        func: this.update,
        method: 'put',
        middlewares: [this.authService, new ValidateMiddleware(baseValidation)],
      },
      {
        path: '/:id',
        func: this.delete,
        method: 'delete',
        middlewares: [this.authService],
      },
    ]);
  }

  async create(req: RequestWithBody<BlogDto>, res: Response) {
    try {
      const _id = await this.blogsService.create(req.body);
      await this.requestWithId(
        req,
        res,
        (_blogId) => this.blogsService.getById(_blogId),
        {
          entity: 'Blog',
          id: _id,
        },
      );
    } catch (e) {
      console.error(e);
      res.status(400).json({ error: 'Bad Request' });
    }
  }

  async getAll(req: RequestWithQuery<Partial<SearchParams>>, res: Response) {
    const blogs = await this.blogsService.getAll(req.query);
    res.status(200).json(blogs);
  }

  async getById(req: RequestWithQuery<{ id?: string }>, res: Response) {
    await this.requestWithId(req, res, (id) => this.blogsService.getById(id), {
      code: 200,
      entity: 'Blog',
    });
  }

  async update(
    req: RequestWithBodyParams<BasePramPayload, BlogDto>,
    res: Response,
  ) {
    await this.requestWithId(
      req,
      res,
      (id) => this.blogsService.update(id, req.body),
      {
        code: 204,
        entity: 'Blog',
      },
    );
  }

  async delete(req: Request<BasePramPayload>, res: Response) {
    await this.requestWithId(req, res, (id) => this.blogsService.delete(id), {
      code: 204,
      entity: 'Blog',
    });
  }
}
