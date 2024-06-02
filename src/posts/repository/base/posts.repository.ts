import { faker } from '@faker-js/faker';
import { inject, injectable } from 'inversify';
import { ObjectId } from 'mongodb';
import 'reflect-metadata';
import { IPost, Post } from '../../entity';
import { BaseRepository, MongoDBClient, TYPES } from '../../../common';
import { PostDto } from '../../dto';
@injectable()
export class PostsRepository extends BaseRepository<IPost> {
  constructor(
    @inject(TYPES.MongoDBClient) readonly mongoDBClient: MongoDBClient,
  ) {
    super(mongoDBClient, 'posts');
  }

  async create(dto: PostDto) {
    const newPost = new Post({
      blogName: faker.lorem.sentence({ min: 1, max: 5 }),
      createdAt: new Date().toISOString(),
      ...dto,
    });
    return await this.repository
      .insertOne({ ...newPost })
      .then((result) => result.insertedId);
  }

  async update(_id: ObjectId, dto: PostDto): Promise<ObjectId | null> {
    const res = await this.repository.findOneAndUpdate(
      { _id },
      {
        $set: { ...dto },
      },
    );

    return res?._id ?? null;
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
