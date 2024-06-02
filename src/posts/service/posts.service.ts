import { PostDto, SearchPostsDto } from '../dto';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IPostsService } from './posts.service.interface';
import { ObjectId } from 'mongodb';
import { PostsQueryRepository, PostsRepository } from '../repository';
import { Pagination, SearchParams, TYPES } from '../../common';
import { BlogPostDto } from '../../blogs/dto';
import { IPostView } from '../entity/post.interface';
import { BlogsQueryRepository } from '../../blogs';

@injectable()
export class PostsService implements IPostsService {
  constructor(
    @inject(TYPES.PostsRepository)
    private readonly postsRepository: PostsRepository,
    @inject(TYPES.PostsQueryRepository)
    private readonly postsQueryRepository: PostsQueryRepository,
    @inject(TYPES.BlogsQueryRepository)
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async createBlogPost(
    blogId: ObjectId,
    dto: BlogPostDto,
  ): Promise<IPostView | null> {
    const blog = await this.blogsQueryRepository.getById(blogId);
    if (!blog) {
      return null;
    }
    const postId = await this.create({ ...dto, blogId: blog.id });
    return await this.postsQueryRepository.getById(postId);
  }

  async create(dto: PostDto): Promise<ObjectId> {
    return await this.postsRepository.create({
      title: dto.title,
      content: dto.content,
      shortDescription: dto.shortDescription,
      blogId: dto.blogId,
    });
  }

  async update(id: ObjectId, dto: PostDto): Promise<IPostView | null> {
    const postId = await this.postsRepository.update(id, {
      title: dto.title,
      content: dto.content,
      shortDescription: dto.shortDescription,
      blogId: dto.blogId,
    });

    if (!postId) {
      return null;
    }

    return await this.postsQueryRepository.getById(postId);
  }

  async getAll(params: SearchParams): Promise<Pagination<IPostView>> {
    const dto = new SearchPostsDto(params);
    return await this.postsQueryRepository.getAll(dto);
  }

  async getById(id: ObjectId): Promise<IPostView | null> {
    return await this.postsQueryRepository.getById(id);
  }

  async delete(id: ObjectId): Promise<boolean> {
    const deletedCount = await this.postsRepository.delete(id);
    return Boolean(deletedCount);
  }
}
