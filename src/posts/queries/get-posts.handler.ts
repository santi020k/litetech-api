import { Repository } from 'typeorm';

import { Post } from '../entities/post.entity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetPostsHandler {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  async execute(page = 1, limit = 9) {
    const [data, count] = await this.postRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total: count,
      page,
      pageCount: Math.ceil(count / limit),
    };
  }
}
