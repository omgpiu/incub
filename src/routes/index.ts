import express, { Request, Response, Router } from 'express';

const homeRouter: Router = express.Router();

/* GET home page. */
homeRouter.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello World!');
});

export { homeRouter };
