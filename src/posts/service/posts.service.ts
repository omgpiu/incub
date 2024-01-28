import { PostDto, SearchPostsDto } from '../dto';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { type IPost } from '../entity';
import { IPostsService } from './posts.service.interface';
import { ObjectId, WithoutId } from 'mongodb';
import { PostsQueryRepository, PostsRepository } from '../repository';
import { Pagination, SearchParams, TYPES } from '../../common';

@injectable()
export class PostsService implements IPostsService {
  constructor(
    @inject(TYPES.PostsRepository)
    private readonly postsRepository: PostsRepository,
    @inject(TYPES.PostsQueryRepository)
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  async create(dto: PostDto): Promise<ObjectId> {
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

  async getAll(params: SearchParams): Promise<Pagination<WithoutId<IPost>>> {
    const dto = new SearchPostsDto(params);
    return await this.postsQueryRepository.getAll(dto);
  }

  async getById(id: ObjectId): Promise<IPost | null> {
    return await this.postsQueryRepository.getById(id);
  }

  async delete(id: ObjectId): Promise<boolean> {
    const deletedCount = await this.postsRepository.delete(id);
    return Boolean(deletedCount);
  }
}
