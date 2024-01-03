import request from 'supertest';
import { App } from '../app';
import { Express } from 'express';
import { bootstrap } from '../main';

describe('Videos', () => {
  let instance: App;

  let appExpress: Express;

  beforeAll(async () => {
    const { appInstance, app } = await bootstrap(6000);

    instance = appInstance;
    appExpress = app;

    await request(appExpress).delete('/testing/all-data').expect(204);
  });

  afterAll(async () => {
    await instance.stop();
  });

  it('GET videos after clear db', async () => {
    await request(appExpress).get('/videos').expect([]);
  });

  it('GET video by id success', async () => {
    const res = await request(appExpress)
      .post('/videos')
      .send({
        title: 'string',
        author: 'string',
        availableResolutions: ['P144'],
      });

    await request(appExpress).get(`/videos/${res.body.id}`).expect(200);
  });

  it('GET video by id with error', async () => {
    await request(appExpress)
      .get(`/videos/00000000000000`)
      .expect(404, { message: 'Video not found' });
  });

  it('POST created video success', async () => {
    await request(appExpress)
      .post('/videos')
      .send({
        title: 'string',
        author: 'string',
        availableResolutions: ['P144'],
      })
      .expect(201);
  });

  it('POST not created video with error', async () => {
    await request(appExpress)
      .post(`/videos`)
      .expect(400, {
        errorsMessages: [
          { message: 'Title is required', field: 'title' },
          { message: 'Author field is required', field: 'author' },
          {
            message: 'Available Resolutions are required',
            field: 'availableResolutions',
          },
        ],
      });
  });

  it('PUT update video by id success', async () => {
    const res = await request(appExpress)
      .post('/videos')
      .send({
        title: 'string',
        author: 'string',
        availableResolutions: ['P144'],
      });

    await request(appExpress)
      .put(`/videos/${res.body.id}`)
      .send({
        title: 'string',
        author: 'string',
        availableResolutions: ['P144'],
        canBeDownloaded: true,
        minAgeRestriction: 18,
        publicationDate: '2023-01-01T00:00:00.000Z',
      })
      .expect(204);
  });

  it('PUT not update video by id with error', async () => {
    const response = await request(appExpress)
      .put(`/videos/44444444`)
      .expect(400);

    const errors = response.body.errorsMessages;

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: 'Title is required',
          field: 'title',
        }),
        expect.objectContaining({
          message: 'Author field is required',
          field: 'author',
        }),
        expect.objectContaining({
          message: 'Available Resolutions are required',
          field: 'availableResolutions',
        }),
        expect.objectContaining({
          message: 'canBeDownloaded field is required',
          field: 'canBeDownloaded',
        }),
        expect.objectContaining({
          message: 'minAgeRestriction field is required',
          field: 'minAgeRestriction',
        }),
        expect.objectContaining({
          message: 'publicationDate field is required',
          field: 'publicationDate',
        }),
      ]),
    );
  });

  it('DELETE delete video by id success', async () => {
    const res = await request(appExpress)
      .post('/videos')
      .send({
        title: 'string',
        author: 'string',
        availableResolutions: ['P144'],
      });

    await request(appExpress).delete(`/videos/${res.body.id}`).expect(204);
  });

  it('DELETE not delete video by id with error', async () => {
    await request(appExpress)
      .delete(`/videos/0000000000`)
      .expect(404, { message: 'Video not found' });
  });
});
