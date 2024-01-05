import { Request, Response } from 'express';
import { ValidationChain } from 'express-validator';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import {
  BaseController,
  ILogger,
  RequestWithBody,
  RequestWithQuery,
  TYPES,
  ValidateMiddleware,
} from '../../common';
import { baseValidation } from '../validation';
import { BasePramPayload, RequestWithBodyParams } from '../../common/types';
import { IPostsService } from '../service';
import { IPostsController } from './posts.controller.interface';
import { PostDto } from '../dto';

@injectable()
export class PostsController
  extends BaseController
  implements IPostsController
{
  private readonly postValidation: ValidationChain[];
  private readonly postsService: IPostsService;

  constructor(
    @inject(TYPES.ILogger) loggerService: ILogger,
    @inject(TYPES.PostsService) postsService: IPostsService,
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
        middlewares: [new ValidateMiddleware(this.postValidation)],
      },
      { path: '/:id', func: this.getById, method: 'get' },
      {
        path: '/:id',
        func: this.update,
        method: 'put',
        middlewares: [new ValidateMiddleware(this.postValidation)],
      },
      { path: '/:id', func: this.delete, method: 'delete' },
    ]);
  }

  async create(req: RequestWithBody<PostDto>, res: Response) {
    const post = await this.postsService.create(req.body);

    if (!post) {
      res.status(400).json({ errorMessage: 'Bad request' });
    } else {
      res.status(201).json(post);
    }
  }

  async getAll(req: Request, res: Response) {
    const posts = await this.postsService.getAll();
    res.status(200).json(posts);
  }

  async getById(req: RequestWithQuery<{ id?: string }>, res: Response) {
    await this.handleWithId(req, res, (id) => this.postsService.getById(id), {
      code: 200,
      entity: 'Post',
    });
  }

  async update(
    req: RequestWithBodyParams<BasePramPayload, PostDto>,
    res: Response,
  ) {
    await this.handleWithId(
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
    await this.handleWithId(req, res, (id) => this.postsService.delete(id), {
      code: 204,
      entity: 'Post',
    });
  }
}
