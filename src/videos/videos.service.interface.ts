import { VideosCreateDto, VideosUpdateDto } from './dto';
import { Video } from './db/video.interface';

export interface IVideosService {
  createVideo: (dto: VideosCreateDto) => Promise<Video | null>;
  updateVideo: (id: string, dto: VideosUpdateDto) => Promise<Video | null>;
  getAll: () => Promise<Video[]>;
  getById: (id: string) => Promise<Video | null>;
  deleteVideo: (id: string) => Promise<boolean>;
}
