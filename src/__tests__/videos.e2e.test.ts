import request from 'supertest';
import { App } from '../app';
import { Express } from 'express';
import bootstrap from '../main';

describe('Videos', () => {
  let appInstance: App;

  let app: Express;

  beforeAll(async () => {
    appInstance = await bootstrap(6000);

    app = appInstance.app;

    await request(app).delete('/testing/all-data').expect(204);
  });

  afterAll(async () => {
    await appInstance.stop();
  });

  it('GET videos after clear db', async () => {
    await request(app).get('/videos').expect([]);
  });

  it('GET video by id success', async () => {
    const res = await request(app)
      .post('/videos')
      .send({
        title: 'string',
        author: 'string',
        availableResolutions: ['P144'],
      });

    await request(app).get(`/videos/${res.body.id}`).expect(200);
  });

  it('GET video by id with error', async () => {
    await request(app)
      .get(`/videos/44444444444`)
      .expect(404, { message: 'Video not found' });
  });

  it('POST created video success', async () => {
    await request(app)
      .post('/videos')
      .send({
        title: 'string',
        author: 'string',
        availableResolutions: ['P144'],
      })
      .expect(201);
  });

  it('POST not created video with error', async () => {
    await request(app)
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
    const res = await request(app)
      .post('/videos')
      .send({
        title: 'string',
        author: 'string',
        availableResolutions: ['P144'],
      });

    await request(app)
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
    await request(app)
      .put(`/videos/44444444`)
      .expect(400, {
        errorsMessages: [
          { message: 'Title is required', field: 'title' },
          { message: 'Author field is required', field: 'author' },
          {
            message: 'Available Resolutions are required',
            field: 'availableResolutions',
          },
          {
            message: 'canBeDownloaded field is required',
            field: 'canBeDownloaded',
          },
          {
            message: 'minAgeRestriction field is required',
            field: 'minAgeRestriction',
          },
          {
            message: 'publicationDate field is required',
            field: 'publicationDate',
          },
        ],
      });
  });

  it('DELETE delete video by id success', async () => {
    const res = await request(app)
      .post('/videos')
      .send({
        title: 'string',
        author: 'string',
        availableResolutions: ['P144'],
      });

    await request(app).delete(`/videos/${res.body.id}`).expect(204);
  });

  it('DELETE not delete video by id with error', async () => {
    await request(app)
      .delete(`/videos/555555555`)
      .expect(404, { message: 'Video not found' });
  });
});
