import { faker } from '@faker-js/faker';
import { generateRandomResolution } from './data.generator';
import { IVideo, Video } from '../entity';

export class VideosDB {
  static dbVideos = Array.from(
    { length: 10 },
    (_, id) =>
      new Video({
        id: id < 3 ? id : faker.number.int(),
        title: faker.lorem.sentence(),
        author: faker.lorem.words({ min: 1, max: 2 }),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(
          new Date().setDate(new Date().getDate() + 1),
        ).toISOString(),
        availableResolutions: generateRandomResolution(),
      }),
  );

  static async getAll() {
    return this.dbVideos;
  }

  static async getById(id: string) {
    return this.dbVideos.find((video) => video.id === Number(id)) ?? null;
  }

  static async create(
    videoData: Pick<IVideo, 'title' | 'author' | 'availableResolutions'>,
  ) {
    const newVideo = new Video({
      id: faker.number.int(),
      ...videoData,
      createdAt: new Date().toISOString(),
      publicationDate: new Date(
        new Date().setDate(new Date().getDate() + 1),
      ).toISOString(),
      canBeDownloaded: false,
      minAgeRestriction: null,
    });

    this.dbVideos.push(newVideo);
    return newVideo;
  }

  static async update(
    id: string,
    updateData: Omit<IVideo, 'id' | 'createdAt'>,
  ): Promise<Video | null> {
    const video = await this.getById(id);

    if (!video) {
      return null;
    }

    video.update(updateData);
    return video;
  }

  static async delete(id: string) {
    const videoIndex = this.dbVideos.findIndex(
      (video) => video.id === Number(id),
    );

    if (videoIndex !== -1) {
      this.dbVideos.splice(videoIndex, 1);
      return true;
    }
    return false;
  }

  static deleteAll() {
    this.dbVideos.splice(0, this.dbVideos.length);
  }
}
