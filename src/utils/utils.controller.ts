import { BaseController, ILogger, TYPES } from '../common';
import { Request, Response } from 'express';
import { VideosDB } from '../videos/db';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IUtilsController } from './utils.controller.inferface';
import { BlogsDb } from '../blogs/db';
import { PostsDb } from '../posts/db';

@injectable()
export class UtilsController
  extends BaseController
  implements IUtilsController
{
  constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
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
    VideosDB.deleteAll();
    BlogsDb.deleteAll();
    PostsDb.deleteAll();
    res.status(204).send('All data is deleted').end();
  }

  async helloWorld(req: Request, res: Response) {
    res.status(200).send('Hello World!');
  }
}
