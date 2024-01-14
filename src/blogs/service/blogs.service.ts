import { BlogDto } from '../dto';
import { BlogsDb } from '../db';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IBlogsService } from './blogs.service.interface';
import { type IBlog } from '../entity';
import { ObjectId } from 'mongodb';

@injectable()
export class BlogsService implements IBlogsService {
  async create(dto: BlogDto): Promise<IBlog | null> {
    return await BlogsDb.create({
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    });
  }
  async update(id: ObjectId, dto: BlogDto): Promise<IBlog | null> {
    return await BlogsDb.update(id, {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    });
  }
  async getAll(): Promise<IBlog[]> {
    return await BlogsDb.getAll();
  }

  async getById(id: ObjectId): Promise<IBlog | null> {
    return await BlogsDb.getById(id);
  }
  async delete(id: ObjectId): Promise<boolean | null> {
    return await BlogsDb.delete(id.toString());
  }
}
