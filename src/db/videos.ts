import { faker } from '@faker-js/faker';
import { generateRandomResolution } from './generate';

export const dbVideos = Array.from({ length: 10 }, (_, id) => ({
  id: id < 3 ? String(id) : faker.string.uuid(),
  title: faker.lorem.sentence(),
  author: faker.lorem.words({ min: 1, max: 2 }),
  canBeDownloaded: faker.datatype.boolean(),
  minAgeRestriction: faker.number.int({ min: 0, max: 21 }),
  createdAt: faker.date.past().toISOString(),
  publicationDate: faker.date.recent().toISOString(),
  availableResolutions: generateRandomResolution(),
}));
