import request from 'supertest';
import App from '../app';
import { Express } from 'express';
import { bootstrap } from '../main';
import { Routes } from '../routes';
import { makeAuthRequest } from './helpers';
import { PostDto } from '../posts/dto';

describe('Posts', () => {
  let instance: App;
  let appExpress: Express;

  const updateCreatePayload: PostDto = {
    title: 'string',
    content: 'string',
    shortDescription: 'string',
    blogId: 'string',
  };

  beforeAll(async () => {
    const { app, express } = await bootstrap(6000);

    instance = app;
    appExpress = express;

    await request(appExpress).delete('/testing/all-data').expect(204);
  });

  afterAll(async () => {
    await instance.stop();
  });

  it('GET posts after clear db', async () => {
    await request(appExpress).get(Routes.POSTS).expect([]);
  });

  it('GET posts by id with error', async () => {
    await request(appExpress)
      .get(Routes.POSTS + `/00000000000000`)
      .expect(404, { message: 'Post not found' });
  });

  it('GET posts by id success', async () => {
    const res = await makeAuthRequest(
      appExpress,
      'post',
      Routes.POSTS,
      updateCreatePayload,
    );

    await request(appExpress)
      .get(Routes.POSTS + `/${res.body.id}`)
      .expect(200);
  });

  it('POST/PUT/DELETE  post with Unauthorized error', async () => {
    await request(appExpress)
      .post(Routes.POSTS)
      .expect(401, { message: 'Unauthorized' });
    await request(appExpress)
      .delete(Routes.POSTS + '/44')
      .expect(401, { message: 'Unauthorized' });
    await request(appExpress)
      .put(Routes.POSTS + '/33')
      .expect(401, { message: 'Unauthorized' });
  });

  it('POST not created post with error', async () => {
    await makeAuthRequest(appExpress, 'post', Routes.POSTS).expect(400, {
      errorsMessages: [
        { message: 'blogId field is required', field: 'blogId' },
        { message: 'Title is required', field: 'title' },
        {
          message: 'shortDescription field is required',
          field: 'shortDescription',
        },
        { message: 'content field is required', field: 'content' },
      ],
    });
  });

  it('POST created post success', async () => {
    await makeAuthRequest(
      appExpress,
      'post',
      Routes.POSTS,
      updateCreatePayload,
    ).expect(201);
  });

  it('PUT update post by id success', async () => {
    const res = await makeAuthRequest(
      appExpress,
      'post',
      Routes.POSTS,
      updateCreatePayload,
    );
    await makeAuthRequest(
      appExpress,
      'put',
      Routes.POSTS + `/${res.body.id}`,
      updateCreatePayload,
    ).expect(204);
  });

  it('PUT not update video by id with error', async () => {
    await makeAuthRequest(
      appExpress,
      'put',
      Routes.POSTS + `/0000000000`,
    ).expect(400, {
      errorsMessages: [
        { message: 'blogId field is required', field: 'blogId' },
        { message: 'Title is required', field: 'title' },
        {
          message: 'shortDescription field is required',
          field: 'shortDescription',
        },
        { message: 'content field is required', field: 'content' },
      ],
    });
  });

  it('DELETE delete video by id success', async () => {
    const res = await makeAuthRequest(
      appExpress,
      'post',
      Routes.POSTS,
      updateCreatePayload,
    );
    await makeAuthRequest(
      appExpress,
      'delete',
      Routes.POSTS + `/${res.body.id}`,
    ).expect(204);
  });

  it('DELETE not delete video by id with error', async () => {
    await makeAuthRequest(
      appExpress,
      'delete',
      Routes.POSTS + '/1001010101010',
    ).expect(404, { message: 'Post not found' });
  });
});
