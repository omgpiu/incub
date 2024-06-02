import { WithoutId } from 'mongodb';

export interface IPost {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}

export interface IPostView extends WithoutId<IPost> {
  id: string;
}
