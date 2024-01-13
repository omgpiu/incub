import { IVideo, Video } from '../entity';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../common';
import MongoDBClient from '../../db';
import { Collection } from 'mongodb';

@injectable()
export class VideosRepository {
  repository: Collection<IVideo>;

  constructor(
    @inject(TYPES.MongoDBClient) private readonly mongoDBClient: MongoDBClient,
  ) {
    this.repository = mongoDBClient.getCollection('videos');
  }

  async getAll() {
    return await this.repository.find().toArray();
  }

  async getById(id: string) {
    return await this.repository.findOne({ id: Number(id) });
  }

  async create(
    videoData: Pick<IVideo, 'title' | 'author' | 'availableResolutions'>,
  ) {
    const newVideo = new Video({
      ...videoData,
      createdAt: new Date().toISOString(),
      publicationDate: new Date(
        new Date().setDate(new Date().getDate() + 1),
      ).toISOString(),
      canBeDownloaded: false,
      minAgeRestriction: null,
    });

    const insertedId = await this.repository
      .insertOne(newVideo)
      .then((result) => result.insertedId);
    return await this.repository.findOne({ _id: insertedId });
  }

  async update(
    _id: string,
    updateData: Omit<IVideo, '_id' | 'createdAt'>,
  ): Promise<Video | null> {
    const video = await this.repository.findOne({ _id });

    if (!video) {
      return null;
    }

    await this.repository.updateOne({ _id }, updateData);

    return null;
  }

  async delete(_id: string) {
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
