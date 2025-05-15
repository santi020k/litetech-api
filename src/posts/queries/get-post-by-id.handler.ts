import { Repository } from 'typeorm';

import { Post } from '../entities/post.entity';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetPostByIdHandler {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  async execute(id: string) {
    const post = await this.postRepo.findOneBy({ id });

    if (!post) throw new NotFoundException('Post not found');

    return post;
  }
}
