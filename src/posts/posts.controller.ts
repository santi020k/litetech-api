import { diskStorage } from 'multer';
import { extname } from 'path';

import { CreatePostHandler } from './commands/create-post.handler';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostByIdHandler } from './queries/get-post-by-id.handler';
import { GetPostsHandler } from './queries/get-posts.handler';

import {
  Body,
  Controller,
  Get,
  Param,
  Post as HttpPost,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/posts')
export class PostsController {
  constructor(
    private readonly createPostHandler: CreatePostHandler,
    private readonly getPostsHandler: GetPostsHandler,
    private readonly getPostByIdHandler: GetPostByIdHandler,
  ) {}

  @Get()
  getPosts(@Query('page') page = 1) {
    return this.getPostsHandler.execute(Number(page));
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.getPostByIdHandler.execute(id);
  }

  @HttpPost()
  @UseInterceptors(
    FileInterceptor('image', {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          const uniqueName = `${Date.now()}${extname(file.originalname)}`;

          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          cb(null, uniqueName);
        },
      }),
    }),
  )
  createPost(
    @Body() body: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const imageUrl = file?.filename ? `/uploads/${file?.filename}` : '';

    return this.createPostHandler.execute(body, imageUrl);
  }
}
