import { Repository } from 'typeorm';

import { CreatePostHandler } from './create-post.handler';

import { Post } from '../entities/post.entity';

import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CreatePostHandler', () => {
  let handler: CreatePostHandler;
  let repo: Repository<Post>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreatePostHandler,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockResolvedValue({
              id: 'uuid',
              title: 'Test Post',
              imageUrl: '/uploads/test.jpg',
              content: 'Markdown content',
            }),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get(CreatePostHandler);

    repo = moduleRef.get(getRepositoryToken(Post));
  });

  it('should create a post successfully', async () => {
    const dto = {
      title: 'Test Post',
      content: 'Markdown content',
    };

    const imageUrl = '/uploads/test.jpg';
    const result = await handler.execute(dto, imageUrl);

    expect(result).toEqual(expect.objectContaining(dto));

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.save).toHaveBeenCalledWith(expect.objectContaining(dto));
  });
});
