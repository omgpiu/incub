import { inject, injectable } from 'inversify';
import { ObjectId } from 'mongodb';
import 'reflect-metadata';
import {
  BaseRepository,
  MongoDBClient,
  TYPES,
  Pagination,
} from '../../../common';
import { SearchPostsDto } from '../../dto';
import { IPostView } from '../../entity/post.interface';

@injectable()
export class PostsQueryRepository extends BaseRepository<IPostView> {
  constructor(
    @inject(TYPES.MongoDBClient) readonly mongoDBClient: MongoDBClient,
  ) {
    super(mongoDBClient, 'posts');
  }

  async getAll(dto: SearchPostsDto): Promise<Pagination<IPostView>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = dto;

    const result = this.transformArrayView(
      await this.repository
        .find()
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .toArray(),
    );
    const totalCount = await this.repository.countDocuments();
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pageSize,
      page: pageNumber,
      pagesCount,
      totalCount,
      items: result,
    };
  }

  async getById(_id: ObjectId): Promise<IPostView | null> {
    const res = await this.repository.findOne({ _id });
    if (res) return this.transformDocumentView(res);
    return null;
  }
}
