import { Repository } from 'typeorm';

import { CreatePostDto } from '../dto/create-post.dto';
import { Post } from '../entities/post.entity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreatePostHandler {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  async execute(dto: CreatePostDto, imageUrl: string) {
    const post = this.postRepo.create({
      ...dto,
      imageUrl,
    });

    return this.postRepo.save(post);
  }
}
