import { faker } from '@faker-js/faker';
export const RESOLUTION = [
  'P144',
  'P240',
  'P360',
  'P480',
  'P720',
  'P1080',
  'P1440',
  'P2160',
];
export const generateRandomResolution = (): string[] => {
  const count = faker.number.int({ min: 1, max: RESOLUTION.length });
  return faker.helpers.shuffle(RESOLUTION).slice(0, count);
};
