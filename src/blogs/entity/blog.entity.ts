import { IBlog } from './blog.interface';

export class Blog implements IBlog {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;

  constructor(data: Omit<IBlog, 'id'>) {
    this.name = data.name;
    this.description = data.description;
    this.websiteUrl = data.websiteUrl;
  }
}
