import { IVideo, Video } from '../entity';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { MongoDBClient, TYPES, BaseRepository } from '../../common';

@injectable()
export class VideosRepository extends BaseRepository<IVideo> {
  constructor(
    @inject(TYPES.MongoDBClient) private readonly mongoDBClient: MongoDBClient,
  ) {
    super(mongoDBClient, 'videos');
  }

  async getAll() {
    return this.transformArray(await this.repository.find().toArray());
  }

  async getById(id: string) {
    return this.transformDocument(await this.repository.findOne({ id }));
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
    const video = await this.repository.findOne({ _id: insertedId });
    return this.transformDocument(video);
  }

  async update(
    id: string,
    updateData: Omit<IVideo, 'id' | 'createdAt'>,
  ): Promise<Video | null> {
    const res = await this.repository.findOne({ id });
    const video = this.transformDocument(res);

    if (!video) {
      return null;
    }

    await this.repository.updateOne({ id }, updateData);

    return null;
  }

  async delete(id: string) {
    return await this.repository
      .deleteOne({
        id,
      })
      .then((res) => res.deletedCount);
  }

  async deleteAll() {
    await this.repository.deleteMany();
  }
}
