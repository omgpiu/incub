import { Request, Response } from 'express';
import { ValidationChain } from 'express-validator';
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
  TYPES,
  ValidateMiddleware,
} from '../../common';
import { baseValidation } from '../validation';
import { IPostsService } from '../service';
import { IPostsController } from './posts.controller.interface';
import { PostDto } from '../dto';
import { IBlogsService } from '../../blogs';

@injectable()
export class PostsController
  extends BaseController
  implements IPostsController
{
  private readonly postValidation: ValidationChain[];

  constructor(
    @inject(TYPES.ILogger) loggerService: ILogger,
    @inject(TYPES.PostsService) private postsService: IPostsService,
    @inject(TYPES.BlogsService) private blogsService: IBlogsService,
    @inject(TYPES.AuthMiddlewareService)
    private authService: AuthMiddlewareService,
  ) {
    super(loggerService);
    this.postsService = postsService;
    this.postValidation = baseValidation;

    this.bindRoutes([
      { path: '/', func: this.getAll, method: 'get' },
      {
        path: '/',
        func: this.create,
        method: 'post',
        middlewares: [
          this.authService,
          new ValidateMiddleware(this.postValidation),
        ],
      },
      { path: '/:id', func: this.getById, method: 'get' },
      {
        path: '/:id',
        func: this.update,
        method: 'put',
        middlewares: [
          this.authService,
          new ValidateMiddleware(this.postValidation),
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

  async create(req: RequestWithBody<PostDto>, res: Response) {
    await this.requestWithId(
      req,
      res,
      (blogId) => this.blogsService.getById(blogId),
      {
        code: 200,
        entity: 'Blog',
        idKey: 'blogId',
        isInternalRequest: true,
      },
    );
    const _id = await this.requestWithId(
      req,
      res,
      () => this.postsService.create(req.body),
      {
        entity: 'Post',
        idKey: 'blogId',
        isInternalRequest: true,
      },
    );

    await this.requestWithId(
      req,
      res,
      (postId) => this.postsService.getById(postId),
      {
        entity: 'Post',
        id: _id,
      },
    );
  }

  async getAll(req: Request, res: Response) {
    const posts = await this.postsService.getAll();
    res.status(200).json(posts);
  }

  async getById(req: RequestWithQuery<{ id?: string }>, res: Response) {
    await this.requestWithId(req, res, (id) => this.postsService.getById(id), {
      code: 200,
      entity: 'Post',
    });
  }

  async update(
    req: RequestWithBodyParams<BasePramPayload, PostDto>,
    res: Response,
  ) {
    await this.requestWithId(
      req,
      res,
      (id) => this.postsService.update(id, req.body),
      {
        code: 204,
        entity: 'Post',
      },
    );
  }

  async delete(req: Request<BasePramPayload>, res: Response) {
    await this.requestWithId(req, res, (id) => this.postsService.delete(id), {
      code: 204,
      entity: 'Post',
    });
  }
}
