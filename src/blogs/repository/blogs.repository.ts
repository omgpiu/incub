import { type IBlog, Blog } from '../entity';
import { ObjectId } from 'mongodb';
import { BaseRepository, MongoDBClient, TYPES } from '../../common';
import { inject, injectable } from 'inversify';
import { BlogDto } from '../dto';
import 'reflect-metadata';

@injectable()
export class BlogsRepository extends BaseRepository<IBlog> {
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

  async create(data: BlogDto) {
    const newBlog = new Blog({
      ...data,
      createdAt: new Date().toISOString(),
      isMembership: false,
    });

    const id = await this.repository
      .insertOne({ ...newBlog })
      .then((result) => result.insertedId.toString());
    return {
      ...newBlog,
      id,
    };
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
