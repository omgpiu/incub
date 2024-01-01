import express, { Request, Response, NextFunction, Router } from 'express';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('<h1>respond with a zalupa</h1>');
});

export default router;
