import { Request } from 'express';

export type RequestWithBody<T> = Request<object, object, T>;
export type RequestWithQuery<T> = Request<object, object, object, T>;
export type RequestWithParams<T> = Request<T>;
