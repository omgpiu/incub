import { Request, Response } from 'express';
import { ILogger, BaseController, ValidateMiddleware, TYPES } from '../common';
import { ValidationChain } from 'express-validator';
import { baseValidation, putValidation } from './validation';
import { IVideosService } from './videos.service.interface';
import { VideosCreateDto, VideosUpdateDto } from './dto';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';

@injectable()
export class VideosController extends BaseController {
  private readonly postValidation: ValidationChain[];
  private readonly putValidation: ValidationChain[];
  private readonly videosService: IVideosService;
  constructor(
    @inject(TYPES.ILogger) loggerService: ILogger,
    @inject(TYPES.VideosService) videosService: IVideosService,
  ) {
    super(loggerService);
    this.videosService = videosService;
    this.postValidation = baseValidation;
    this.putValidation = [...baseValidation, ...putValidation];

    this.bindRoutes([
      { path: '/', func: this.getAll, method: 'get' },
      {
        path: '/',
        func: this.create,
        method: 'post',
        middlewares: [new ValidateMiddleware(this.postValidation)],
      },
      { path: '/:id', func: this.getById, method: 'get' },
      {
        path: '/:id',
        func: this.update,
        method: 'put',
        middlewares: [new ValidateMiddleware(this.putValidation)],
      },
      { path: '/:id', func: this.delete, method: 'delete' },
    ]);
  }

  async create(req: Request, res: Response) {
    const video = await this.videosService.createVideo(
      req.body as VideosCreateDto,
    );

    if (!video) {
      return res.status(400).json({ errorMessage: 'Bad request' });
    } else {
      res.status(201).json(video);
    }
  }

  async getAll(req: Request, res: Response) {
    const videos = await this.videosService.getAll();
    res.status(200).json(videos);
  }

  async getById(req: Request, res: Response) {
    const video = await this.videosService.getById(req.params.id);
    if (video) {
      res.status(200).json(video);
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  }

  async update(req: Request, res: Response) {
    const updatedVideo = await this.videosService.updateVideo(
      req.params.id,
      req.body as VideosUpdateDto,
    );

    if (updatedVideo) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  }

  async delete(req: Request, res: Response) {
    const isDeleteSuccessful = await this.videosService.deleteVideo(
      req.params.id,
    );

    if (!req.params.id || !isDeleteSuccessful) {
      res.status(404).send({ message: 'Video not found' });
      return;
    }

    res.status(204).end();
  }
}
