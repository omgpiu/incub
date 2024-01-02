import { NextFunction, Request, Response, Router } from 'express';
import { ValidationChain } from 'express-validator';

type ApiCall = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;
type Validate = (
  rules: ValidationChain[],
) => (req: Request, res: Response, next: NextFunction) => Promise<void>;

export interface IControllerRoute {
  path: string;
  middleware: ApiCall | Array<ApiCall | Validate>;
  // func: (req: Request, res: Response, next: NextFunction) => void;
  method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
}
