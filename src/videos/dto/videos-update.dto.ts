import { ResolutionType } from '../db';

export class VideosUpdateDto {
  title: string;
  author: string;
  availableResolutions: ResolutionType[];
  canBeDownloaded: boolean;
  minAgeRestriction: number;
  publicationDate: string;
}
