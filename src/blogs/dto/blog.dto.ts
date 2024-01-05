import { IBlog } from '../entity';

export class BlogDto implements Omit<IBlog, 'id'> {
  name: string;
  description: string;
  websiteUrl: string;
}
