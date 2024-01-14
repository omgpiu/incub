import { IVideo, Video } from '../entity';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { MongoDBClient, TYPES, BaseRepository } from '../../common';
import { ObjectId } from 'mongodb';
import { VideoCreateDto, VideoUpdateDto } from '../dto';

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

  async getById(_id: ObjectId) {
    const res = await this.repository.findOne({ _id });
    if (res) return this.transformDocument(res);
    return null;
  }

  async create(videoData: VideoCreateDto) {
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
    _id: ObjectId,
    updateData: VideoUpdateDto,
  ): Promise<Video | null> {
    const res = await this.repository.findOneAndUpdate(
      { _id },
      {
        $set: updateData,
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
