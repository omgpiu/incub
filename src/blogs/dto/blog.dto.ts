import { IBlogView } from '../entity/blog.interface';

export class BlogDto
  implements Omit<IBlogView, 'id' | 'createdAt' | 'isMembership'>
{
  name: string;
  description: string;
  websiteUrl: string;
}
