import { Collection, WithId } from 'mongodb';
import { injectable, unmanaged } from 'inversify';
import 'reflect-metadata';
import { MongoDBClient } from '../db';
@injectable()
export abstract class BaseRepository<T extends object> {
  protected repository: Collection<T>;

  constructor(@unmanaged() client: MongoDBClient, collectionName: string) {
    this.repository = client.getCollection(collectionName);
  }

  protected transformDocument(doc: WithId<T>): T {
    if (!doc) return doc;
    const { _id, ...rest } = doc;
    return { id: _id, ...rest } as unknown as T;
  }
  protected transformArray(docs: WithId<T>[]): T[] {
    return docs.map((doc) => this.transformDocument(doc));
  }
}
