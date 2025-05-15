import { CreatePostHandler } from './commands/create-post.handler';
import { Post } from './entities/post.entity';
import { GetPostByIdHandler } from './queries/get-post-by-id.handler';
import { GetPostsHandler } from './queries/get-posts.handler';
import { PostsController } from './posts.controller';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [CreatePostHandler, GetPostsHandler, GetPostByIdHandler],
})
export class PostsModule {}
