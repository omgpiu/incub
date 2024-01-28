import { BlogDto } from '../dto';
import { IBlog } from '../entity';
import { ObjectId, WithoutId } from 'mongodb';
import { SearchParams, Pagination } from '../../common';

export interface IBlogsService {
  create: (dto: BlogDto) => Promise<ObjectId>;
  update: (id: ObjectId, dto: BlogDto) => Promise<IBlog | null>;
  getAll: (params: SearchParams) => Promise<Pagination<WithoutId<IBlog>>>;
  getById: (id: ObjectId) => Promise<IBlog | null>;
  delete: (id: ObjectId) => Promise<boolean | null>;
}
