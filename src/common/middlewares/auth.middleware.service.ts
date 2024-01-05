import { IMiddleware } from '../interfaces';
import { NextFunction, Request, Response } from 'express';
import { injectable } from 'inversify';

import 'reflect-metadata';

@injectable()
export class AuthMiddlewareService implements IMiddleware {
  constructor() {}

  execute(req: Request, res: Response, next: NextFunction): void {
    const auth = req.headers['authorization'];
    if (!auth) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const [basic, token] = auth.split(' ');

    if (basic !== 'Basic') {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const decoded = Buffer.from(token, 'base64').toString();

    const [login, password] = decoded.split(':');
    console.log(process.env, 'auth');
    console.log(process.env.BASIC_LOGIN, 'auth2');
    console.log(login);
    console.log(password);
    if (
      login !== process.env.BASIC_LOGIN ||
      password !== process.env.BASIC_PASSWORD
    ) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    next();
  }
}
