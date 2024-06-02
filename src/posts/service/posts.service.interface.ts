import { PostDto } from '../dto';
import { ObjectId } from 'mongodb';
import { Pagination, SearchParams } from '../../common';
import { BlogPostDto } from '../../blogs/dto';
import { IPostView } from '../entity/post.interface';

export interface IPostsService {
  createBlogPost: (
    blogId: ObjectId,
    dto: BlogPostDto,
  ) => Promise<IPostView | null>;
  create: (dto: PostDto) => Promise<ObjectId>;
  update: (id: ObjectId, dto: PostDto) => Promise<IPostView | null>;
  getAll: (params: SearchParams) => Promise<Pagination<IPostView>>;
  getById: (id: ObjectId) => Promise<IPostView | null>;
  delete: (id: ObjectId) => Promise<boolean | null>;
}
