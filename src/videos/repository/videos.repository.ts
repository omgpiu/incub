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
    const res = await this.repository.findOne({ id });

    return res ? this.transformDocument(res) : res;
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

    return {
      ...newVideo,
      id: insertedId.toString(),
    };
  }

  async update(
    id: string,
    updateData: Omit<IVideo, 'id' | 'createdAt'>,
  ): Promise<Video | null> {
    const res = await this.repository.findOneAndUpdate(
      { id },
      {
        $set: updateData,
      },
    );
    if (!res) {
      return null;
    }
    return this.transformDocument(res);
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
