import { BlogDto } from '../dto';
import { BlogsDb } from '../db';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IBlogsService } from './blogs.service.interface';
import { type IBlog } from '../entity';

@injectable()
export class BlogsService implements IBlogsService {
  async create(dto: BlogDto): Promise<IBlog | null> {
    return await BlogsDb.create({
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    });
  }
  async update(id: string, dto: BlogDto): Promise<IBlog | null> {
    return await BlogsDb.update(id, {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    });
  }
  async getAll(): Promise<IBlog[]> {
    return await BlogsDb.getAll();
  }

  async getById(id: string): Promise<IBlog | null> {
    return await BlogsDb.getById(id);
  }
  async delete(id: string): Promise<boolean | null> {
    return await BlogsDb.delete(id);
  }
}
