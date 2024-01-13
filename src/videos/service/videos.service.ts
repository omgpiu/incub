import { VideoCreateDto, VideoUpdateDto } from '../dto';
import { VideosRepository } from '../repository';
import { IVideosService } from './videos.service.interface';
import { IVideo } from '../entity';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../common';

@injectable()
export class VideosService implements IVideosService {
  constructor(
    @inject(TYPES.VideosRepository)
    private readonly videosRepository: VideosRepository,
  ) {}
  async createVideo(dto: VideoCreateDto): Promise<IVideo | null> {
    const newVideo = await this.videosRepository.create({
      title: dto.title,
      author: dto.author,
      availableResolutions: dto.availableResolutions,
    });

    return newVideo ?? null;
  }
  async updateVideo(id: string, dto: VideoUpdateDto): Promise<IVideo | null> {
    return await this.videosRepository.update(id, {
      title: dto.title,
      author: dto.author,
      canBeDownloaded: dto.canBeDownloaded,
      minAgeRestriction: dto.minAgeRestriction,
      availableResolutions: dto.availableResolutions,
      publicationDate: dto.publicationDate,
    });
  }
  async getAll(): Promise<IVideo[]> {
    return await this.videosRepository.getAll();
  }

  async getById(id: string): Promise<IVideo | null> {
    return await this.videosRepository.getById(id);
  }
  async deleteVideo(id: string): Promise<boolean | null> {
    const deletedCount = await this.videosRepository.delete(id);
    return deletedCount ? null : true;
  }
}
