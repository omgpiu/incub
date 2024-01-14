import { PostDto } from '../dto';
import { type IPost } from '../entity';
import { ObjectId } from 'mongodb';

export interface IPostsService {
  create: (dto: PostDto) => Promise<IPost | null>;
  update: (id: ObjectId, dto: PostDto) => Promise<IPost | null>;
  getAll: () => Promise<IPost[]>;
  getById: (id: ObjectId) => Promise<IPost | null>;
  delete: (id: ObjectId) => Promise<boolean | null>;
}
