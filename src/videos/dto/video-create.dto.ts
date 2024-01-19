import { ResolutionType } from '../repository';

export class VideoCreateDto {
  title: string;
  author: string;
  availableResolutions: ResolutionType[];
}
