import { PostDto } from '../dto';
import { PostsDb } from '../db';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { type IPost } from '../entity';
import { IPostsService } from './posts.service.interface';
import { ObjectId } from 'mongodb';

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

  async update(id: ObjectId, dto: PostDto): Promise<IPost | null> {
    return await PostsDb.update(id.toString(), {
      title: dto.title,
      content: dto.content,
      shortDescription: dto.shortDescription,
      blogId: dto.blogId,
    });
  }

  async getAll(): Promise<IPost[]> {
    return await PostsDb.getAll();
  }

  async getById(id: ObjectId): Promise<IPost | null> {
    return await PostsDb.getById(id.toString());
  }

  async delete(id: ObjectId): Promise<boolean | null> {
    return await PostsDb.delete(id.toString());
  }
}
