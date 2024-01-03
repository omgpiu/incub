import { Request, Response } from 'express';
import { ILogger, BaseController, ValidateMiddleware } from '../common';
import { VideosDB } from './db';
import { ValidationChain } from 'express-validator';
import { baseValidation, putValidation } from './validation';

export class VideosController extends BaseController {
  private readonly postValidation: ValidationChain[];
  private readonly putValidation: ValidationChain[];
  constructor(logger: ILogger) {
    super(logger);
    this.postValidation = baseValidation;
    this.putValidation = [...baseValidation, ...putValidation];

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
        middlewares: [new ValidateMiddleware(this.putValidation)],
      },
      { path: '/:id', func: this.delete, method: 'delete' },
    ]);
  }

  async create(req: Request, res: Response) {
    const resPayload = {
      title: req.body.title,
      author: req.body.author,
      availableResolutions: req.body.availableResolutions,
    };

    const responce = VideosDB.create(resPayload);
    res.status(201).json(responce);
  }

  async getAll(req: Request, res: Response) {
    res.send(VideosDB.getAll());
  }

  async getById(req: Request, res: Response) {
    const video = VideosDB.getById(req.params.id);
    if (video) {
      res.status(200).json(video);
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  }

  async update(req: Request, res: Response) {
    const updatedVideo = VideosDB.update(req.params.id, {
      title: req.body.title,
      author: req.body.author,
      canBeDownloaded: req.body.canBeDownloaded,
      minAgeRestriction: req.body.minAgeRestriction,
      availableResolutions: req.body.availableResolutions,
      publicationDate: req.body.publicationDate,
    });

    if (updatedVideo) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  }

  async delete(req: Request, res: Response) {
    const isDeleteSuccessful = VideosDB.delete(req.params.id);
    if (!req.params.id || !isDeleteSuccessful) {
      res.status(404).send({ message: 'Video not found' });
      return;
    }

    res.status(204).end();
  }
}
