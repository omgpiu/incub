import { BlogDto } from '../dto';
import { ObjectId } from 'mongodb';
import { SearchParams, Pagination } from '../../common';
import { IBlogView } from '../entity/blog.interface';

export interface IBlogsService {
  create: (dto: BlogDto) => Promise<ObjectId>;
  update: (id: ObjectId, dto: BlogDto) => Promise<IBlogView | null>;
  getAll: (params: SearchParams) => Promise<Pagination<IBlogView>>;
  getById: (id: ObjectId) => Promise<IBlogView | null>;
  delete: (id: ObjectId) => Promise<boolean | null>;
}
