import { RESOLUTION } from './generate';
import { dbVideos } from './videos';

export type Resolution = (typeof RESOLUTION)[number];
export type Video = (typeof dbVideos)[number];
