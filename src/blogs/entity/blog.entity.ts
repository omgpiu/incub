import { IBlog } from './blog.interface';
import { ObjectId } from 'mongodb';

export class Blog implements IBlog {
  _id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;

  constructor(data: Omit<IBlog, '_id'>) {
    this.name = data.name;
    this.description = data.description;
    this.websiteUrl = data.websiteUrl;
    this.createdAt = data.createdAt;
    this.isMembership = data.isMembership;
  }
}
