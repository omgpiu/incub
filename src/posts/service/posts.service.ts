import { PostDto } from '../dto';
import { PostsDb } from '../db';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { type IPost } from '../entity';
import { IPostsService } from './posts.service.interface';

@injectable()
export class PostsService implements IPostsService {
  async create(dto: PostDto): Promise<IPost | null> {
    return await PostsDb.create({
      title: dto.title,
      content: dto.content,
      shortDescription: dto.shortDescription,
      blogId: dto.blogId,
    });
  }

  async update(id: string, dto: PostDto): Promise<IPost | null> {
    return await PostsDb.update(id, {
      title: dto.title,
      content: dto.content,
      shortDescription: dto.shortDescription,
      blogId: dto.blogId,
    });
  }

  async getAll(): Promise<IPost[]> {
    return await PostsDb.getAll();
  }

  async getById(id: string): Promise<IPost | null> {
    return await PostsDb.getById(id);
  }

  async delete(id: string): Promise<boolean | null> {
    return await PostsDb.delete(id);
  }
}
