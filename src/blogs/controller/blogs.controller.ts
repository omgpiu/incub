import { Request, Response } from 'express';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import {
  AuthMiddlewareService,
  BaseController,
  BaseParamPayload,
  ILogger,
  RequestWithBody,
  RequestWithBodyParams,
  RequestWithQuery,
  SearchParams,
  TYPES,
  ValidateMiddleware,
} from '../../common';
import {
  baseValidation,
  createBlogPostValidation,
  getAllValidation,
} from '../validation';
import { type BlogDto, BlogPostDto } from '../dto';
import { IBlogsService } from '../service';
import { IBlogsController } from './blogs.controller.interface';
import { IPostsService } from '../../posts';

@injectable()
export class BlogsController
  extends BaseController
  implements IBlogsController
{
  constructor(
    @inject(TYPES.ILogger) loggerService: ILogger,
    @inject(TYPES.BlogsService) private blogsService: IBlogsService,
    @inject(TYPES.PostsService) private postsService: IPostsService,
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
        func: this.createBlog,
        method: 'post',
        middlewares: [this.authService, new ValidateMiddleware(baseValidation)],
      },
      {
        path: '/:id/posts',
        func: this.createBlogPost,
        method: 'post',
        middlewares: [
          this.authService,
          new ValidateMiddleware(createBlogPostValidation),
        ],
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

  async createBlogPost(
    req: RequestWithBodyParams<BaseParamPayload, BlogPostDto>,
    res: Response,
  ) {
    await this.requestWithId(
      req,
      res,
      (_blogId) => this.blogsService.getById(_blogId),
      {
        entity: 'Blog',
        id: req.params.id,
        isInternalRequest: true,
      },
    );

    await this.requestWithId(
      req,
      res,
      (blogId) =>
        this.postsService.create({
          blogId: blogId.toString(),
          ...req.body,
        }),
      {
        entity: 'Post',
        code: 201,
      },
    );
  }

  async createBlog(req: RequestWithBody<BlogDto>, res: Response) {
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
    req: RequestWithBodyParams<BaseParamPayload, BlogDto>,
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

  async delete(req: Request<BaseParamPayload>, res: Response) {
    await this.requestWithId(req, res, (id) => this.blogsService.delete(id), {
      code: 204,
      entity: 'Blog',
    });
  }
}
