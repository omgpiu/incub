import { Request, Response } from 'express';
import { ValidationChain } from 'express-validator';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import {
  BaseController,
  ILogger,
  RequestWithBody,
  RequestWithQuery,
  TYPES,
  ValidateMiddleware,
} from '../../common';
import { baseValidation, putValidation } from '../validation';
import { IVideosService } from '../service';
import { VideoCreateDto, VideoUpdateDto } from '../dto';
import { IVideosController } from './videos.controller.interface';
import { BasePramPayload, RequestWithBodyParams } from '../../common/types';
@injectable()
export class VideosController
  extends BaseController
  implements IVideosController
{
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

  async create(req: RequestWithBody<VideoCreateDto>, res: Response) {
    const video = await this.videosService.createVideo(req.body);

    if (!video) {
      res.status(400).json({ errorMessage: 'Bad request' });
    } else {
      res.status(201).json(video);
    }
  }

  async getAll(req: Request, res: Response) {
    const videos = await this.videosService.getAll();
    res.status(200).json(videos);
  }

  async getById(req: RequestWithQuery<{ id?: string }>, res: Response) {
    await this.handleWithId(req, res, (id) => this.videosService.getById(id), {
      code: 200,
      entity: 'Video',
    });
  }

  async update(
    req: RequestWithBodyParams<BasePramPayload, VideoUpdateDto>,
    res: Response,
  ) {
    await this.handleWithId(
      req,
      res,
      (id) => this.videosService.updateVideo(id, req.body),
      {
        code: 204,
        entity: 'Video',
      },
    );
  }

  async delete(req: Request<BasePramPayload>, res: Response) {
    await this.handleWithId(
      req,
      res,
      (id) => this.videosService.deleteVideo(id),
      {
        code: 204,
        entity: 'Video',
      },
    );
  }
}
