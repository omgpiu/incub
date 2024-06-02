import { Request, Response } from 'express';

export interface IBlogsController {
  createBlog(req: Request, res: Response): Promise<void>;
  createBlogPost(req: Request, res: Response): Promise<void>;
  getAll(req: Request, res: Response): Promise<void>;
  getById(req: Request, res: Response): Promise<void>;
  update(req: Request, res: Response): Promise<void>;
  delete(req: Request, res: Response): Promise<void>;
}
