import request from 'supertest';
import App from '../app';
import { Express } from 'express';
import { bootstrap } from '../main';
import { Routes } from '../routes';
import { BlogDto } from '../blogs/dto';
import { makeAuthRequest } from './helpers';

describe('Blogs', () => {
  let instance: App;
  let appExpress: Express;

  const updateCreatePayload: BlogDto = {
    name: 'string',
    description: 'string',
    websiteUrl: 'https://google.com',
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

  it('GET blogs after clear db', async () => {
    await request(appExpress).get(Routes.BLOGS).expect([]);
  });

  it('GET video by id with error', async () => {
    await request(appExpress)
      .get(Routes.BLOGS + `/00000000000000`)
      .expect(404, { message: 'Blog not found' });
  });

  it('GET blogs by id success', async () => {
    const res = await makeAuthRequest(
      appExpress,
      'post',
      Routes.BLOGS,
      updateCreatePayload,
    );

    await request(appExpress)
      .get(Routes.BLOGS + `/${res.body.id}`)
      .expect(200);
  });

  it('POST/PUT/DELETE  blog with Unauthorized error', async () => {
    await request(appExpress)
      .post(Routes.BLOGS)
      .expect(401, { message: 'Unauthorized' });
    await request(appExpress)
      .delete(Routes.BLOGS + '/44')
      .expect(401, { message: 'Unauthorized' });
    await request(appExpress)
      .put(Routes.BLOGS + '/33')
      .expect(401, { message: 'Unauthorized' });
  });

  it('POST not created blog with error', async () => {
    await makeAuthRequest(appExpress, 'post', Routes.BLOGS).expect(400, {
      errorsMessages: [
        { message: 'WebsiteUrl is required', field: 'websiteUrl' },
        { message: 'Name is required', field: 'name' },
        { message: 'Description field is required', field: 'description' },
      ],
    });
  });

  it('POST created blog success', async () => {
    await makeAuthRequest(
      appExpress,
      'post',
      Routes.BLOGS,
      updateCreatePayload,
    ).expect(201);
  });

  it('PUT update blog by id success', async () => {
    const res = await makeAuthRequest(
      appExpress,
      'post',
      Routes.BLOGS,
      updateCreatePayload,
    );
    await makeAuthRequest(
      appExpress,
      'put',
      Routes.BLOGS + `/${res.body.id}`,
      updateCreatePayload,
    ).expect(204);
  });

  it('PUT not update video by id with error', async () => {
    const response = await makeAuthRequest(
      appExpress,
      'put',
      Routes.BLOGS + `/0000000000`,
    ).expect(400);

    const errors = response.body.errorsMessages;

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: 'Name is required',
          field: 'name',
        }),
        expect.objectContaining({
          message: 'Description field is required',
          field: 'description',
        }),
        expect.objectContaining({
          message: 'WebsiteUrl is required',
          field: 'websiteUrl',
        }),
      ]),
    );
  });

  it('DELETE delete video by id success', async () => {
    const res = await makeAuthRequest(
      appExpress,
      'post',
      Routes.BLOGS,
      updateCreatePayload,
    );
    await makeAuthRequest(
      appExpress,
      'delete',
      Routes.BLOGS + `/${res.body.id}`,
    ).expect(204);
  });

  it('DELETE not delete video by id with error', async () => {
    await makeAuthRequest(
      appExpress,
      'delete',
      Routes.BLOGS + '/1001010101010',
    ).expect(404, { message: 'Blog not found' });
  });
});
