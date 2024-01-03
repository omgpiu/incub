import express, { Request, Response, Router } from 'express';
import { VideoDB } from '../db';

const testRouter: Router = express.Router();
testRouter.delete('/all-data', (req: Request, res: Response) => {
  VideoDB.deleteAll();
  res.status(204).send('All data is deleted').end();
});

export { testRouter };
