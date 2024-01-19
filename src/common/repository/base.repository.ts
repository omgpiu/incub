import { Collection, WithId, WithoutId } from 'mongodb';
import { injectable, unmanaged } from 'inversify';
import 'reflect-metadata';
import { MongoDBClient } from '../db';
@injectable()
export abstract class BaseRepository<T extends object> {
  protected repository: Collection<T>;

  constructor(@unmanaged() client: MongoDBClient, collectionName: string) {
    this.repository = client.getCollection(collectionName);
  }

  protected transformDocument(doc: WithId<T>): WithoutId<T> {
    if (!doc) return doc;
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...rest } as WithoutId<T>;
  }
  protected transformArray(docs: WithId<T>[]): WithoutId<T>[] {
    return docs.map((doc) => this.transformDocument(doc));
  }
}
