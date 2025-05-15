import { GetPostByIdHandler } from './get-post-by-id.handler';

import { Post } from '../entities/post.entity';

import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('GetPostByIdHandler', () => {
  let handler: GetPostByIdHandler;
  let findOneBy: jest.Mock;

  beforeEach(async () => {
    findOneBy = jest.fn();

    const moduleRef = await Test.createTestingModule({
      providers: [
        GetPostByIdHandler,
        {
          provide: getRepositoryToken(Post),
          useValue: { findOneBy },
        },
      ],
    }).compile();

    handler = moduleRef.get(GetPostByIdHandler);
  });

  it('should return post if found', async () => {
    const post = { id: '1', title: 'Post' };

    findOneBy.mockResolvedValue(post);

    const result = await handler.execute('1');

    expect(result).toEqual(post);
  });

  it('should throw if post not found', async () => {
    findOneBy.mockResolvedValue(null);

    await expect(handler.execute('123')).rejects.toThrow(NotFoundException);
  });
});
