import { Request, Response } from 'express';

export interface IUtilsController {
  cleanDBs(req: Request, res: Response): Promise<void>;
  helloWorld(req: Request, res: Response): Promise<void>;
}
