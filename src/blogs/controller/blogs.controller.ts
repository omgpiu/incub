import { Request, Response } from 'express';
import { ValidationChain } from 'express-validator';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import {
  AuthMiddlewareService,
  BaseController,
  ILogger,
  RequestWithBody,
  RequestWithQuery,
  TYPES,
  ValidateMiddleware,
  BasePramPayload,
  RequestWithBodyParams,
} from '../../common';
import { baseValidation } from '../validation';
import { type BlogDto } from '../dto';
import { IBlogsService } from '../service';
import { IBlogsController } from './blogs.controller.interface';
@injectable()
export class BlogsController
  extends BaseController
  implements IBlogsController
{
  private readonly validation: ValidationChain[];

  constructor(
    @inject(TYPES.ILogger) loggerService: ILogger,
    @inject(TYPES.BlogsService) private blogsService: IBlogsService,
    @inject(TYPES.AuthMiddlewareService)
    private authService: AuthMiddlewareService,
  ) {
    super(loggerService);
    this.validation = baseValidation;

    this.bindRoutes([
      { path: '/', func: this.getAll, method: 'get' },
      {
        path: '/',
        func: this.create,
        method: 'post',
        middlewares: [
          this.authService,
          new ValidateMiddleware(this.validation),
        ],
      },
      { path: '/:id', func: this.getById, method: 'get' },
      {
        path: '/:id',
        func: this.update,
        method: 'put',
        middlewares: [
          this.authService,
          new ValidateMiddleware(this.validation),
        ],
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
      const _blogId = await this.blogsService.create(req.body);
      const blog = await this.blogsService.getById(_blogId);
      res.status(201).json(blog);
    } catch (e) {
      console.error(e);
      res.status(400).json({ error: 'Bad Request' });
    }
  }

  async getAll(req: Request, res: Response) {
    const blogs = await this.blogsService.getAll();
    res.status(200).json(blogs);
  }

  async getById(req: RequestWithQuery<{ id?: string }>, res: Response) {
    await this.handleWithId(req, res, (id) => this.blogsService.getById(id), {
      code: 200,
      entity: 'Blog',
    });
  }

  async update(
    req: RequestWithBodyParams<BasePramPayload, BlogDto>,
    res: Response,
  ) {
    await this.handleWithId(
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
    await this.handleWithId(req, res, (id) => this.blogsService.delete(id), {
      code: 204,
      entity: 'Blog',
    });
  }
}
