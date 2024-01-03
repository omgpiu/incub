import { BaseController, ILogger } from '../common';
import { Request, Response } from 'express';
import { VideosDB } from '../videos/db';

export class UtilsController extends BaseController {
  constructor(logger: ILogger) {
    super(logger);

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
    res.status(204).send('All data is deleted').end();
  }

  async helloWorld(req: Request, res: Response) {
    res.status(200).send('Hello World!');
  }
}
