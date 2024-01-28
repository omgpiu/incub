import { Request } from 'express';
import { ObjectId, SortDirection } from 'mongodb';

export type RequestWithBody<B> = Request<object, object, B>;
export type RequestWithBodyParams<P, B> = Request<P, object, B>;

export type RequestWithQuery<T> = Request<object, object, object, T>;

export interface BasePramPayload {
  id?: ObjectId;
}
export interface SearchParams {
  searchNameTerm?: string;
  sortBy?: string;
  pageNumber?: number;
  pageSize?: number;
  sortDirection?: SortDirection;
}
