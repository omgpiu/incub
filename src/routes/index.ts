import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

/* GET home page. */
router.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello World!');
});

export default router;
