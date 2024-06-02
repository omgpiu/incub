import { IPostView } from '../entity/post.interface';

export class PostDto
  implements Omit<IPostView, 'id' | 'blogName' | 'createdAt'>
{
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}
