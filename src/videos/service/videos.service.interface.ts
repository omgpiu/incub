import { VideoCreateDto, VideoUpdateDto } from '../dto';
import { IVideo } from '../entity';

export interface IVideosService {
  createVideo: (dto: VideoCreateDto) => Promise<IVideo | null>;
  updateVideo: (id: string, dto: VideoUpdateDto) => Promise<IVideo | null>;
  getAll: () => Promise<IVideo[]>;
  getById: (id: string) => Promise<IVideo | null>;
  deleteVideo: (id: string) => Promise<boolean | null>;
}
