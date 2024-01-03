import { VideosCreateDto, VideosUpdateDto } from './dto';
import { IVideo } from './video.interface';

export interface IVideosService {
  createVideo: (dto: VideosCreateDto) => Promise<IVideo | null>;
  updateVideo: (id: string, dto: VideosUpdateDto) => Promise<IVideo | null>;
  getAll: () => Promise<IVideo[]>;
  getById: (id: string) => Promise<IVideo | null>;
  deleteVideo: (id: string) => Promise<boolean>;
}
