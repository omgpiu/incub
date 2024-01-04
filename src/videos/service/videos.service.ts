import { VideoCreateDto, VideoUpdateDto } from '../dto';
import { VideosDB } from '../db';
import { IVideosService } from './videos.service.interface';
import { IVideo } from '../entity';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class VideosService implements IVideosService {
  async createVideo(dto: VideoCreateDto): Promise<IVideo | null> {
    return await VideosDB.create({
      title: dto.title,
      author: dto.author,
      availableResolutions: dto.availableResolutions,
    });
  }
  async updateVideo(id: string, dto: VideoUpdateDto): Promise<IVideo | null> {
    return await VideosDB.update(id, {
      title: dto.title,
      author: dto.author,
      canBeDownloaded: dto.canBeDownloaded,
      minAgeRestriction: dto.minAgeRestriction,
      availableResolutions: dto.availableResolutions,
      publicationDate: dto.publicationDate,
    });
  }
  async getAll(): Promise<IVideo[]> {
    return await VideosDB.getAll();
  }

  async getById(id: string): Promise<IVideo | null> {
    return await VideosDB.getById(id);
  }
  async deleteVideo(id: string): Promise<boolean | null> {
    return await VideosDB.delete(id);
  }
}
