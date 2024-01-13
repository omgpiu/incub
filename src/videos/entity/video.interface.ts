import { ResolutionType } from '../repository';

export interface IVideo {
  id: string;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: null | number;
  createdAt: string;
  publicationDate: string;
  availableResolutions: ResolutionType[];
}
