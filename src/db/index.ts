import { Collection, MongoClient } from 'mongodb';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ILogger, TYPES } from '../common';
@injectable()
class MongoDBClient {
  private static instance: MongoDBClient;
  private readonly client: MongoClient;
  private isConnected: boolean = false;

  constructor(@inject(TYPES.ILogger) private readonly logger: ILogger) {
    if (!process.env.MONGO_URL) {
      console.log(process.env);
      this.logger.error('MONGO_URL is not defined');
      throw new Error('MONGO_URL is not defined');
    }
    this.client = new MongoClient(process.env.MONGO_URL);
  }

  public async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.client.connect();
        this.isConnected = true;
        this.logger.log('Connected correctly to DB');
      } catch (error) {
        if (error instanceof Error) {
          this.logger.error('DB  connection error:' + error.message);
        }
      }
    }
  }

  public getClient(): MongoClient {
    return this.client;
  }
  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.close();
      this.logger.log('Disconnected from MongoDB');
    }
  }
  getCollection<T extends object>(collectionName: string): Collection<T> {
    return this.client.db().collection<T>(collectionName);
  }
}

export default MongoDBClient;
