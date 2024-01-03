import { VideosCreateDto, VideosUpdateDto } from './dto';
import { VideosDB } from './db';
import { IVideosService } from './videos.service.interface';
import { IVideo } from './video.interface';

export class VideosService implements IVideosService {
  async createVideo(dto: VideosCreateDto): Promise<IVideo | null> {
    return await VideosDB.create({
      title: dto.title,
      author: dto.author,
      availableResolutions: dto.availableResolutions,
    });
  }
  async updateVideo(id: string, dto: VideosUpdateDto): Promise<IVideo | null> {
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
  async deleteVideo(id: string): Promise<boolean> {
    return await VideosDB.delete(id);
  }
}
