import { Request } from 'express';

export type RequestWithBody<B> = Request<object, object, B>;
export type RequestWithBodyParams<P, B> = Request<P, object, B>;

export type RequestWithQuery<T> = Request<object, object, object, T>;
