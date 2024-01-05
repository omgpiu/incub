import { IPost } from '../entity';

export class PostDto implements Omit<IPost, 'id' | 'blogName'> {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}
