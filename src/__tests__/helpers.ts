import { Application } from 'express';
import request, { Test } from 'supertest';

export function requestWithAuth<T>(
  app: Application,
  method: 'post' | 'put' | 'delete',
  url: string,
  body?: T,
): Test {
  let req = request(app)
    [method](url)
    .set('authorization', 'Basic YWRtaW46cXdlcnR5');
  if (body) {
    req = req.send(body);
  }
  return req;
}
