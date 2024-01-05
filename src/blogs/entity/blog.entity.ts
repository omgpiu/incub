import { IBlog } from './blog.interface';

export class Blog implements IBlog {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;

  constructor(data: IBlog) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.websiteUrl = data.websiteUrl;
  }

  update(updateData: Omit<IBlog, 'id'>) {
    Object.assign(this, updateData);
  }
}
