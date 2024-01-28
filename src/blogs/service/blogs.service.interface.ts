import { BlogDto } from '../dto';
import { IBlog } from '../entity';
import { ObjectId } from 'mongodb';

export interface IBlogsService {
  create: (dto: BlogDto) => Promise<ObjectId>;
  update: (id: ObjectId, dto: BlogDto) => Promise<IBlog | null>;
  getAll: () => Promise<IBlog[]>;
  getById: (id: ObjectId) => Promise<IBlog | null>;
  delete: (id: ObjectId) => Promise<boolean | null>;
}
