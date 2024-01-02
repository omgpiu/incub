import express, { Request, Response, Router } from 'express';
import {
  FieldValidationError,
  Result,
  validationResult,
} from 'express-validator';
import { VideoManager } from '../db';
import { baseInputValidation, putValidation } from '../videos';
import { checkForError } from '../helpers';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send(VideoManager.getAll());
});

router.get('/:id', (req: Request, res: Response) => {
  const video = VideoManager.getById(req.params.id);
  if (video) {
    return res.status(200).json(video);
  } else {
    return res.status(404).json({ message: 'Video not found' });
  }
});
router.post('/', baseInputValidation, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (checkForError(res, errors as Result<FieldValidationError>)) {
    return;
  }
  const resPayload = {
    title: req.body.title,
    author: req.body.author,
    availableResolutions: req.body.availableResolutions,
  };

  const responce = VideoManager.create(resPayload);
  return res.status(201).json(responce);
});

router.put(
  '/:id',
  [...baseInputValidation, ...putValidation],
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (checkForError(res, errors as Result<FieldValidationError>)) {
      return;
    }

    const updatedVideo = VideoManager.update(req.params.id, {
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
  },
);

router.delete('/:id', (req: Request, res: Response) => {
  const isDeleteSuccessful = VideoManager.delete(req.params.id);
  if (!req.params.id || !isDeleteSuccessful) {
    return res.status(404).send({ message: 'Video not found' });
  }

  return res.status(204).end();
});

export default router;
