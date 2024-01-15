import { BaseController, ILogger, TYPES } from '../common';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IUtilsController } from './utils.controller.inferface';
import { VideosRepository } from '../videos';
import { BlogsRepository } from '../blogs';
import { PostsRepository } from '../posts';

@injectable()
export class UtilsController
  extends BaseController
  implements IUtilsController
{
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.VideosRepository) private videosRepository: VideosRepository,
    @inject(TYPES.BlogsRepository) private blogsRepository: BlogsRepository,
    @inject(TYPES.PostsRepository) private postsRepository: PostsRepository,
  ) {
    super(loggerService);

    this.bindRoutes([
      { path: '/', func: this.helloWorld, method: 'get' },
      {
        path: '/testing/all-data',
        func: this.cleanDBs,
        method: 'delete',
      },
    ]);
  }

  async cleanDBs(req: Request, res: Response) {
    await this.videosRepository.deleteAll();
    await this.blogsRepository.deleteAll();
    await this.postsRepository.deleteAll();
    res.status(204).send('All data is deleted').end();
  }

  async helloWorld(req: Request, res: Response) {
    res.status(200).send('Hello World!');
  }
}
