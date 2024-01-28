import { ObjectId } from 'mongodb';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BlogDto } from '../../dto';
import { BaseRepository, MongoDBClient, TYPES } from '../../../common';
import { Blog, IBlog } from '../../entity';

@injectable()
export class BlogsRepository extends BaseRepository<IBlog> {
  constructor(
    @inject(TYPES.MongoDBClient) readonly mongoDBClient: MongoDBClient,
  ) {
    super(mongoDBClient, 'blogs');
  }

  async create(data: BlogDto): Promise<ObjectId> {
    const newBlog = new Blog({
      ...data,
      createdAt: new Date().toISOString(),
      isMembership: false,
    });

    return await this.repository
      .insertOne({ ...newBlog })
      .then((result) => result.insertedId);
  }

  async update(_id: ObjectId, dto: BlogDto): Promise<IBlog | null> {
    const res = await this.repository.findOneAndUpdate(
      { _id },
      {
        $set: dto,
      },
    );
    if (res) {
      return this.transformDocument(res);
    }
    return null;
  }

  async delete(_id: ObjectId) {
    return await this.repository
      .deleteOne({
        _id,
      })
      .then((res) => res.deletedCount);
  }

  async deleteAll() {
    await this.repository.deleteMany();
  }
}
