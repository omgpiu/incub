import { faker } from '@faker-js/faker';
import { generateRandomResolution } from './generate';
import { Video } from './types';

export class VideoManager {
  static dbVideos: Video[] = Array.from({ length: 10 }, (_, id) => ({
    id: id < 3 ? String(id) : faker.string.uuid(),
    title: faker.lorem.sentence(),
    author: faker.lorem.words({ min: 1, max: 2 }),
    canBeDownloaded: faker.datatype.boolean(),
    minAgeRestriction: faker.number.int({ min: 0, max: 21 }),
    createdAt: faker.date.past().toISOString(),
    publicationDate: faker.date.recent().toISOString(),
    availableResolutions: generateRandomResolution(),
  }));

  static getAll() {
    return this.dbVideos;
  }

  static getById(id: string) {
    return this.dbVideos.find((video) => video.id === id);
  }

  static create(
    videoData: Omit<Video, 'id' | 'createdAt' | 'publicationDate'>,
  ) {
    const newVideo = {
      id: faker.string.uuid(),
      ...videoData,
      createdAt: new Date().toISOString(),
      publicationDate: new Date().toISOString(),
    };
    this.dbVideos.push(newVideo);
    return newVideo;
  }

  static update(
    id: string,
    updateData: Omit<Video, 'id' | 'createdAt'>,
  ): Video | null {
    const video = this.getById(id);

    if (!video) {
      return null;
    }

    Object.assign(video, updateData, {
      publicationDate: new Date().toISOString(),
    });
    return video;
  }

  static delete(id: string) {
    const videoIndex = this.dbVideos.findIndex((video) => video.id === id);
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
