import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger';
import { BaseController } from '../common/base.controller';
import { VideoDB } from '../db';
import { baseInputValidation } from '../videos';

export class VideoController extends BaseController {
  constructor(logger: LoggerService) {
    super(logger);
    this.bindRoutes([
      { path: '/', middleware: this.getAll, method: 'get' },
      {
        path: '/',
        middleware: [this.validate(baseInputValidation), this.create],
        method: 'post',
      },
      { path: '/:id', middleware: this.getById, method: 'get' },
      { path: '/:id', middleware: this.update, method: 'put' },
      { path: '/:id', middleware: this.delete, method: 'delete' },
    ]);
  }

  async getAll(req: Request, res: Response) {
    res.send(VideoDB.getAll());
  }

  async getById(req: Request, res: Response) {
    const video = VideoDB.getById(req.params.id);
    if (video) {
      res.status(200).json(video);
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  }

  async create(req: Request, res: Response) {
    const resPayload = {
      title: req.body.title,
      author: req.body.author,
      availableResolutions: req.body.availableResolutions,
    };

    const responce = VideoDB.create(resPayload);
    res.status(201).json(responce);
  }

  async update(req: Request, res: Response) {
    const updatedVideo = VideoDB.update(req.params.id, {
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
    const isDeleteSuccessful = VideoDB.delete(req.params.id);
    if (!req.params.id || !isDeleteSuccessful) {
      res.status(404).send({ message: 'Video not found' });
      return;
    }

    res.status(204).end();
  }
}
