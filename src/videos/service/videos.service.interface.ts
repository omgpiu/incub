import { VideoCreateDto, VideoUpdateDto } from '../dto';
import { IVideo } from '../entity';
import { ObjectId } from 'mongodb';

export interface IVideosService {
  createVideo: (dto: VideoCreateDto) => Promise<IVideo | null>;
  updateVideo: (id: ObjectId, dto: VideoUpdateDto) => Promise<IVideo | null>;
  getAll: () => Promise<IVideo[]>;
  getById: (id: ObjectId) => Promise<IVideo | null>;
  deleteVideo: (id: ObjectId) => Promise<boolean | null>;
}
