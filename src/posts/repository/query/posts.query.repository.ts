import { inject, injectable } from 'inversify';
import { ObjectId } from 'mongodb';
import 'reflect-metadata';
import { IPost } from '../../entity';
import { BaseRepository, MongoDBClient, TYPES } from '../../../common';
@injectable()
export class PostsQueryRepository extends BaseRepository<IPost> {
  constructor(
    @inject(TYPES.MongoDBClient) readonly mongoDBClient: MongoDBClient,
  ) {
    super(mongoDBClient, 'posts');
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
