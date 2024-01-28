import { ObjectId } from 'mongodb';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BaseRepository, MongoDBClient, TYPES } from '../../../common';
import { IBlog } from '../../entity';

@injectable()
export class BlogsQueryRepository extends BaseRepository<IBlog> {
  constructor(
    @inject(TYPES.MongoDBClient) readonly mongoDBClient: MongoDBClient,
  ) {
    super(mongoDBClient, 'blogs');
  }

  async getAll() {
    return this.transformArray(await this.repository.find().toArray());
  }

  async getById(_id: ObjectId) {
    const res = await this.repository.findOne({ _id });
    if (res) return this.transformDocument(res);
    return null;
  }
}
