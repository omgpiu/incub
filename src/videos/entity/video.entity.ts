import { IVideo } from './video.interface';

export class Video implements IVideo {
  id: string;
  title: string;
  author: string;
  availableResolutions: string[];
  createdAt: string;
  publicationDate: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;

  constructor(videoData: Omit<IVideo, 'id'>) {
    this.title = videoData.title;
    this.author = videoData.author;
    this.availableResolutions = videoData.availableResolutions;
    this.createdAt = videoData.createdAt;
    this.publicationDate = videoData.publicationDate;
    this.canBeDownloaded = videoData.canBeDownloaded;
    this.minAgeRestriction = videoData.minAgeRestriction;
  }

  update(updateData: Omit<IVideo, 'createdAt'>) {
    Object.assign(this, updateData);
  }
}
