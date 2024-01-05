import { faker } from '@faker-js/faker';
import { Post, type IBlog } from '../entity';

export class BlogsDb {
  static dbBlogs = Array.from(
    { length: 10 },
    (_, id) =>
      new Post({
        id: id < 3 ? String(id) : faker.number.int().toString(),
        name: faker.lorem.sentence(),
        description: faker.lorem.words({ min: 5, max: 500 }),
        websiteUrl: faker.internet.url(),
      }),
  );

  static async getAll() {
    return this.dbBlogs;
  }

  static async getById(id: string) {
    return this.dbBlogs.find((video) => video.id === id) ?? null;
  }

  static async create(data: Omit<IBlog, 'id'>) {
    const newBlog = new Post({
      id: faker.number.int().toString(),
      ...data,
    });

    this.dbBlogs.push(newBlog);
    return newBlog;
  }

  static async update(
    id: string,
    updateData: Omit<IBlog, 'id'>,
  ): Promise<IBlog | null> {
    const blog = await this.getById(id);

    if (!blog) {
      return null;
    }

    blog.update(updateData);
    return blog;
  }

  static async delete(id: string) {
    const idx = this.dbBlogs.findIndex((blog) => blog.id === id);

    if (idx !== -1) {
      this.dbBlogs.splice(idx, 1);
      return true;
    }
    return null;
  }

  static deleteAll() {
    this.dbBlogs.splice(0, this.dbBlogs.length);
  }
}
