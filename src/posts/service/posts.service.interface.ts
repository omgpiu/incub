import { PostDto } from '../dto';
import { type IPost } from '../entity';
import { ObjectId, WithoutId } from 'mongodb';
import { Pagination, SearchParams } from '../../common';

export interface IPostsService {
  create: (dto: PostDto) => Promise<ObjectId>;
  update: (id: ObjectId, dto: PostDto) => Promise<IPost | null>;
  getAll: (params: SearchParams) => Promise<Pagination<WithoutId<IPost>>>;
  getById: (id: ObjectId) => Promise<IPost | null>;
  delete: (id: ObjectId) => Promise<boolean | null>;
}
