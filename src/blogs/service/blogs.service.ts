import { BlogDto } from '../dto';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IBlogsService } from './blogs.service.interface';
import { type IBlog } from '../entity';
import { ObjectId } from 'mongodb';
import { TYPES } from '../../common';
import { BlogsRepository } from '../repository';

@injectable()
export class BlogsService implements IBlogsService {
  constructor(
    @inject(TYPES.BlogsRepository)
    private readonly blogsRepository: BlogsRepository,
  ) {}
  async create(dto: BlogDto): Promise<IBlog | null> {
    return await this.blogsRepository.create({
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    });
  }
  async update(id: ObjectId, dto: BlogDto): Promise<IBlog | null> {
    return await this.blogsRepository.update(id, {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    });
  }
  async getAll(): Promise<IBlog[]> {
    return await this.blogsRepository.getAll();
  }

  async getById(id: ObjectId): Promise<IBlog | null> {
    const blog = await this.blogsRepository.getById(id);
    console.log(blog, 'blog');
    return blog;
  }
  async delete(id: ObjectId): Promise<boolean | null> {
    const deletedCount = await this.blogsRepository.delete(id);
    return Boolean(deletedCount);
  }
}
