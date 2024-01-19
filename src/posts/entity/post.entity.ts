import { IPost } from './post.interface';

export class Post implements IPost {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;

  constructor(data: Omit<IPost, 'id'>) {
    this.title = data.title;
    this.shortDescription = data.shortDescription;
    this.content = data.content;
    this.blogId = data.blogId;
    this.blogName = data.blogName;
  }
}
