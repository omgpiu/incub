import { inject, injectable } from 'inversify';
import { ObjectId, WithoutId } from 'mongodb';
import 'reflect-metadata';
import { IPost } from '../../entity';
import {
  BaseRepository,
  MongoDBClient,
  TYPES,
  Pagination,
} from '../../../common';
import { SearchPostsDto } from '../../dto';

@injectable()
export class PostsQueryRepository extends BaseRepository<IPost> {
  constructor(
    @inject(TYPES.MongoDBClient) readonly mongoDBClient: MongoDBClient,
  ) {
    super(mongoDBClient, 'posts');
  }

  async getAll(dto: SearchPostsDto): Promise<Pagination<WithoutId<IPost>>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = dto;

    const result = this.transformArray(
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

  async getById(_id: ObjectId) {
    const res = await this.repository.findOne({ _id });
    if (res) return this.transformDocument(res);
    return null;
  }
}
