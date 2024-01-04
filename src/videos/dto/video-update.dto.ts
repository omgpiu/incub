import { ResolutionType } from '../db';

export class VideoUpdateDto {
  title: string;
  author: string;
  availableResolutions: ResolutionType[];
  canBeDownloaded: boolean;
  minAgeRestriction: number;
  publicationDate: string;
}
