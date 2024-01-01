import express, { Request, Response, Router } from 'express';
import { VideoManager } from '../db';

const router: Router = express.Router();
router.delete('/all-data', (req: Request, res: Response) => {
  VideoManager.deleteAll();
  return res.status(204).send('All data is deleted').end();
});

export default router;
