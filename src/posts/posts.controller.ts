import {
  Controller,
  Get,
  Body,
  Param,
  Post,
  Delete,
  Req,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CustomRequest } from 'src/types';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Authenticate } from 'src/auth/auth.guard';

@Controller('posts')
@Authenticate()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() { session }: CustomRequest,
  ) {
    return this.postsService.create(createPostDto, session.id);
  }

  @Get()
  findAll(@Req() { session }: CustomRequest) {
    return this.postsService.findAll(session.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() { session }: CustomRequest,
  ) {
    return this.postsService.update(id, updatePostDto, session.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() { session }: CustomRequest) {
    return this.postsService.remove(id, session.id);
  }
}
