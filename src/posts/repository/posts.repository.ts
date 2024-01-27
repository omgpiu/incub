import { faker } from '@faker-js/faker';
import { Post, IPost } from '../entity';
import { BaseRepository, MongoDBClient, TYPES } from '../../common';
import { inject, injectable } from 'inversify';
import { ObjectId } from 'mongodb';
import { PostDto } from '../dto';
import 'reflect-metadata';
@injectable()
export class PostsRepository extends BaseRepository<IPost> {
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

  async create(dto: PostDto) {
    const newPost = new Post({
      blogName: faker.lorem.sentence({ min: 1, max: 5 }),
      createdAt: new Date().toISOString(),
      ...dto,
    });
    const id = await this.repository
      .insertOne({ ...newPost })
      .then((result) => result.insertedId.toString());

    return {
      ...newPost,
      id,
    };
  }

  async update(_id: ObjectId, dto: PostDto): Promise<IPost | null> {
    const res = await this.repository.findOneAndUpdate(
      { _id },
      {
        $set: { ...dto, createdAt: new Date().toISOString() },
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
