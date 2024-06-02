import { ObjectId } from 'mongodb';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BaseRepository, MongoDBClient, TYPES } from '../../../common';
import { IBlog } from '../../entity';
import { SearchBlogsDto } from '../../dto';

@injectable()
export class BlogsQueryRepository extends BaseRepository<IBlog> {
  constructor(
    @inject(TYPES.MongoDBClient) readonly mongoDBClient: MongoDBClient,
  ) {
    super(mongoDBClient, 'blogs');
  }

  async getAll(dto: SearchBlogsDto) {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } = dto;
    let filter = {};
    if (dto.searchNameTerm) {
      filter = {
        name: {
          $regex: searchNameTerm,
          $options: 'i',
        },
      };
    }
    const result = this.transformArray(
      await this.repository
        .find(filter)
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .toArray(),
    );
    const totalCount = await this.repository.countDocuments(filter);
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
