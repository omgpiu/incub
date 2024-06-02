import { ObjectId, WithoutId } from 'mongodb';

export interface IBlog {
  _id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export interface IBlogView extends WithoutId<IBlog> {
  id: string;
}
