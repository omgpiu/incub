import { RESOLUTION } from './generate';

export type Resolution = (typeof RESOLUTION)[number];
export interface Video {
  id: string | number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: null | number;
  createdAt: string;
  publicationDate: string;
  availableResolutions: Resolution[];
}
