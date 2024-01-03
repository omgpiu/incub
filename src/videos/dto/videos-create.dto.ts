import { ResolutionType } from '../db';

export class VideosCreateDto {
  title: string;
  author: string;
  availableResolutions: ResolutionType[];
}
