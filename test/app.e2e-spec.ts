import { join } from 'path';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';

import { Post } from '../src/posts/entities/post.entity';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('LiteTech API E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Post],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
  });

  it('/api/posts (POST) should create a post', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer())
      .post('/api/posts')
      .field('title', 'Test Title')
      .field('content', '# Markdown Title\n\nSome text')
      .attach('image', join(__dirname, 'assets/test-image.jpg'))
      .expect(201);

    expect(res.body).toHaveProperty('id');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(res.body.title).toBe('Test Title');
  });

  it('/api/posts (GET) should return paginated posts', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer())
      .get('/api/posts?page=1')
      .expect(200);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(res.body.data.length).toBeGreaterThan(0);

    expect(res.body).toHaveProperty('total');

    expect(res.body).toHaveProperty('page');
  });

  it('/api/posts/:id (GET) should return post by id', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const created = await request(app.getHttpServer())
      .post('/api/posts')
      .field('title', 'Another Post')
      .field('content', 'Content')
      .attach('image', join(__dirname, 'assets/test-image.jpg'));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const postId = created.body.id;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer())
      .get(`/api/posts/${postId}`)
      .expect(200);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(res.body.title).toBe('Another Post');
  });

  afterAll(async () => {
    await app.close();
  });
});
