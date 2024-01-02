import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger';
import { BaseController } from '../common/base.controller';
import { VideoDB } from '../db';

import {
  FieldValidationError,
  Result,
  validationResult,
} from 'express-validator';
import { checkForError } from '../helpers';

export class VideoController extends BaseController {
  constructor(logger: LoggerService) {
    super(logger);
    this.bindRoutes([
      { path: '/', func: this.getAll, method: 'get' },
      { path: '/', func: this.create, method: 'post' },
      { path: '/:id', func: this.getById, method: 'get' },
      { path: '/:id', func: this.update, method: 'put' },
      { path: '/:id', func: this.delete, method: 'delete' },
    ]);
  }

  getAll(req: Request, res: Response) {
    res.send(VideoDB.getAll());
  }

  getById(req: Request, res: Response) {
    const video = VideoDB.getById(req.params.id);
    if (video) {
      return res.status(200).json(video);
    } else {
      return res.status(404).json({ message: 'Video not found' });
    }
  }
  create(req: Request, res: Response) {
    const errors = validationResult(req);
    if (checkForError(res, errors as Result<FieldValidationError>)) {
      return;
    }
    const resPayload = {
      title: req.body.title,
      author: req.body.author,
      availableResolutions: req.body.availableResolutions,
    };

    const responce = VideoDB.create(resPayload);
    return res.status(201).json(responce);
  }

  update(req: Request, res: Response) {
    const errors = validationResult(req);

    if (checkForError(res, errors as Result<FieldValidationError>)) {
      return;
    }

    const updatedVideo = VideoDB.update(req.params.id, {
      title: req.body.title,
      author: req.body.author,
      canBeDownloaded: req.body.canBeDownloaded,
      minAgeRestriction: req.body.minAgeRestriction,
      availableResolutions: req.body.availableResolutions,
      publicationDate: req.body.publicationDate,
    });

    if (updatedVideo) {
      return res.status(204).end();
    } else {
      return res.status(404).json({ message: 'Video not found' });
    }
  }

  delete(req: Request, res: Response) {
    const isDeleteSuccessful = VideoDB.delete(req.params.id);
    if (!req.params.id || !isDeleteSuccessful) {
      return res.status(404).send({ message: 'Video not found' });
    }

    return res.status(204).end();
  }
}
