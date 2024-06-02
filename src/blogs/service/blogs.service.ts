import { BlogDto, SearchBlogsDto } from '../dto';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IBlogsService } from './blogs.service.interface';
import { ObjectId } from 'mongodb';
import { SearchParams, TYPES } from '../../common';
import { BlogsQueryRepository, BlogsRepository } from '../repository';
import { type IBlogView } from '../entity/blog.interface';

@injectable()
export class BlogsService implements IBlogsService {
  constructor(
    @inject(TYPES.BlogsRepository)
    private readonly blogsRepository: BlogsRepository,
    @inject(TYPES.BlogsQueryRepository)
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async create(dto: BlogDto): Promise<ObjectId> {
    return await this.blogsRepository.create({
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    });
  }

  async update(id: ObjectId, dto: BlogDto): Promise<IBlogView | null> {
    await this.blogsRepository.update(id, {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    });

    return await this.blogsQueryRepository.getById(id);
  }

  async getAll(params: SearchParams) {
    const dto = new SearchBlogsDto(params);
    return await this.blogsQueryRepository.getAll(dto);
  }

  async getById(id: ObjectId): Promise<IBlogView | null> {
    return await this.blogsQueryRepository.getById(id);
  }

  async delete(id: ObjectId): Promise<boolean | null> {
    const deletedCount = await this.blogsRepository.delete(id);
    return Boolean(deletedCount);
  }
}
