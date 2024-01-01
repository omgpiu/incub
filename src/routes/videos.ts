import express, { Request, Response, Router } from 'express';
import {
  FieldValidationError,
  Result,
  validationResult,
} from 'express-validator';
import { dbVideos } from '../db';
import { faker } from '@faker-js/faker';
import { baseInputValidation, putValidation } from '../videos';
import { checkForError } from '../helpers';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send(dbVideos);
});
router.post('/', baseInputValidation, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (checkForError(res, errors as Result<FieldValidationError>)) {
    return;
  }
  const newVideo = {
    id: faker.string.uuid(),
    title: req.body.title,
    author: req.body.author ?? faker.name.firstName(),
    canBeDownloaded: req.body.canBeDownloaded ?? true,
    minAgeRestriction: req.body.minAgeRestriction ?? null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions: req.body.availableResolutions,
  };
  dbVideos.push(newVideo);
  return res.status(201).json(newVideo);
});

router.get('/:id', (req: Request, res: Response) => {
  const video = dbVideos.find((video) => video.id === req.params.id);
  if (video) {
    return res.status(200).json(video);
  } else {
    return res.status(404).json({ message: 'Video not found' });
  }
});

router.put(
  '/:id',
  [...baseInputValidation, ...putValidation],
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (checkForError(res, errors as Result<FieldValidationError>)) {
      return;
    }

    const video = dbVideos.find((video) => video.id === req.params.id);
    if (video) {
      video.title = req.body.title;
      video.author = req.body.author;
      video.canBeDownloaded = req.body.canBeDownloaded;
      video.minAgeRestriction = req.body.minAgeRestriction;
      video.availableResolutions = req.body.availableResolutions;
      video.publicationDate = req.body.publicationDate;

      return res.status(204);
    } else {
      return res.status(404);
    }
  },
);

router.delete('/:id', (req: Request, res: Response) => {
  const videoIndex = dbVideos.findIndex((video) => video.id === req.params.id);
  if (videoIndex !== -1) {
    dbVideos.splice(videoIndex, 1);
    return res.status(204).end();
  } else {
    return res.status(404).send('Video not found');
  }
});

export default router;
