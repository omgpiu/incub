import { Request } from 'express';
import { ObjectId } from 'mongodb';

export type RequestWithBody<B> = Request<object, object, B>;
export type RequestWithBodyParams<P, B> = Request<P, object, B>;

export type RequestWithQuery<T> = Request<object, object, object, T>;

export interface BasePramPayload {
  id?: ObjectId;
}

export interface Zalupa {
  [key: string]: unknown;
}
