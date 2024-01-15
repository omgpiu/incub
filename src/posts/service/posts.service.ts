import { PostDto } from '../dto';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { type IPost } from '../entity';
import { IPostsService } from './posts.service.interface';
import { ObjectId } from 'mongodb';
import { TYPES } from '../../common';
import { PostsRepository } from '../repository';

@injectable()
export class PostsService implements IPostsService {
  constructor(
    @inject(TYPES.PostsRepository)
    private readonly postsRepository: PostsRepository,
  ) {}
  async create(dto: PostDto): Promise<IPost | null> {
    return await this.postsRepository.create({
      title: dto.title,
      content: dto.content,
      shortDescription: dto.shortDescription,
      blogId: dto.blogId,
    });
  }

  async update(id: ObjectId, dto: PostDto): Promise<IPost | null> {
    return await this.postsRepository.update(id, {
      title: dto.title,
      content: dto.content,
      shortDescription: dto.shortDescription,
      blogId: dto.blogId,
    });
  }

  async getAll(): Promise<IPost[]> {
    return await this.postsRepository.getAll();
  }

  async getById(id: ObjectId): Promise<IPost | null> {
    return await this.postsRepository.getById(id);
  }

  async delete(id: ObjectId): Promise<boolean> {
    const deletedCount = await this.postsRepository.delete(id);
    return Boolean(deletedCount);
  }
}
