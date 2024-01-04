import { ResolutionType } from '../db';

export class VideoCreateDto {
  title: string;
  author: string;
  availableResolutions: ResolutionType[];
}
