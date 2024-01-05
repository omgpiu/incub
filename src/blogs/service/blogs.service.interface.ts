import { BlogDto } from '../dto';
import { IBlog } from '../entity';

export interface IBlogsService {
  create: (dto: BlogDto) => Promise<IBlog | null>;
  update: (id: string, dto: BlogDto) => Promise<IBlog | null>;
  getAll: () => Promise<IBlog[]>;
  getById: (id: string) => Promise<IBlog | null>;
  delete: (id: string) => Promise<boolean | null>;
}
