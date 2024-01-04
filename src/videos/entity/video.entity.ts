import { IVideo } from './video.interface';

export class Video implements IVideo {
  id: number;
  title: string;
  author: string;
  availableResolutions: string[];
  createdAt: string;
  publicationDate: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;

  constructor(videoData: IVideo) {
    this.id = videoData.id;
    this.title = videoData.title;
    this.author = videoData.author;
    this.availableResolutions = videoData.availableResolutions;
    this.createdAt = videoData.createdAt;
    this.publicationDate = videoData.publicationDate;
    this.canBeDownloaded = videoData.canBeDownloaded;
    this.minAgeRestriction = videoData.minAgeRestriction;
  }

  update(updateData: Omit<IVideo, 'id' | 'createdAt'>) {
    Object.assign(this, updateData);
  }
}
