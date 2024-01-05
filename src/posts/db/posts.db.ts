import { faker } from '@faker-js/faker';
import { Post, IPost } from '../entity';

export class PostsDb {
  static dbPosts = Array.from(
    { length: 10 },
    (_, id) =>
      new Post({
        id: id < 3 ? String(id) : faker.number.int().toString(),
        title: faker.lorem.sentence({ min: 1, max: 30 }),
        shortDescription: faker.lorem.words({ min: 5, max: 100 }),
        content: faker.lorem.words({ min: 5, max: 1000 }),
        blogId: id < 3 ? String(id) : faker.number.int().toString(),
        blogName: faker.lorem.sentence({ min: 1, max: 5 }),
      }),
  );

  static async getAll() {
    return this.dbPosts;
  }

  static async getById(id: string) {
    return this.dbPosts.find((post) => post.id === id) ?? null;
  }

  static async create(data: Omit<IPost, 'id' | 'blogName'>) {
    const newPost = new Post({
      id: faker.number.int().toString(),
      blogName: faker.lorem.sentence({ min: 1, max: 5 }),
      ...data,
    });

    this.dbPosts.push(newPost);
    return newPost;
  }

  static async update(
    id: string,
    updateData: Omit<IPost, 'id' | 'blogName'>,
  ): Promise<IPost | null> {
    const post = await this.getById(id);

    if (!post) {
      return null;
    }
    const payload = {
      ...updateData,
      blogName: post.blogName,
    };
    post.update(payload);
    return post;
  }

  static async delete(id: string) {
    const idx = this.dbPosts.findIndex((post) => post.id === id);

    if (idx !== -1) {
      this.dbPosts.splice(idx, 1);
      return true;
    }
    return null;
  }

  static deleteAll() {
    this.dbPosts.splice(0, this.dbPosts.length);
  }
}
