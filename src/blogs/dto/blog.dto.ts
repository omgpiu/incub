import { IBlog } from '../entity';

export class BlogDto
  implements Omit<IBlog, 'id' | 'createdAt' | 'isMembership'>
{
  name: string;
  description: string;
  websiteUrl: string;
}
