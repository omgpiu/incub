import { PostDto } from '../dto';
import { type IPost } from '../entity';

export interface IPostsService {
  create: (dto: PostDto) => Promise<IPost | null>;
  update: (id: string, dto: PostDto) => Promise<IPost | null>;
  getAll: () => Promise<IPost[]>;
  getById: (id: string) => Promise<IPost | null>;
  delete: (id: string) => Promise<boolean | null>;
}
