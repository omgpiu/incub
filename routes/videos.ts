import express, { Request, Response, Router } from 'express';
import { check, validationResult } from 'express-validator';
import { dbVideos } from '../db/videos';
import { Video } from '../db/types';
import { faker } from '@faker-js/faker';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send(dbVideos);
});
router.post(
  '/',
  [
    check('title').notEmpty().withMessage('Title is required'),
    check('author').notEmpty().withMessage('Author is required'),
    check('availableResolutions')
      .notEmpty()
      .withMessage('Available Resolutions are required'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const newVideo: Video = {
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
    }
  },
);
export default router;
