import { VideoCreateDto, VideoUpdateDto } from '../dto';
import { VideosRepository } from '../repository';
import { IVideosService } from './videos.service.interface';
import { IVideo } from '../entity';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../common';
import { ObjectId } from 'mongodb';

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
  async updateVideo(id: ObjectId, dto: VideoUpdateDto): Promise<IVideo | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }
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

  async getById(id: ObjectId): Promise<IVideo | null> {
    return await this.videosRepository.getById(id);
  }
  async deleteVideo(id: ObjectId): Promise<boolean> {
    const deletedCount = await this.videosRepository.delete(id);
    return Boolean(deletedCount);
  }
}
