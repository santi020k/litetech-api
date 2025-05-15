import { GetPostsHandler } from './get-posts.handler';

import { Post } from '../entities/post.entity';

import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('GetPostsHandler', () => {
  let handler: GetPostsHandler;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetPostsHandler,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([
              [{ id: '1', title: 'Test' }], // data
              1, // count
            ]),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get(GetPostsHandler);
  });

  it('should return paginated posts', async () => {
    const result = await handler.execute(1, 9);

    expect(result.data.length).toBe(1);

    expect(result.total).toBe(1);

    expect(result.page).toBe(1);
  });
});
