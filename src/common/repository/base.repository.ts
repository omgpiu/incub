import { Collection } from 'mongodb';
import { injectable, unmanaged } from 'inversify';
import 'reflect-metadata';
import { MongoDBClient } from '../db';
@injectable()
export abstract class BaseRepository<T extends { _id: string }> {
  protected repository: Collection<T>;

  constructor(@unmanaged() client: MongoDBClient, collectionName: string) {
    this.repository = client.getCollection(collectionName);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected transformDocument(doc: any): T {
    if (!doc) return doc;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    const { _id, ...rest } = doc;
    return { id: _id, ...rest } as unknown as T;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected transformArray(docs: any[]): T[] {
    return docs.map((doc) => this.transformDocument(doc));
  }
}
