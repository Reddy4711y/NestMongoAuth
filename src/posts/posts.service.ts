import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from 'src/schemas/posts.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}
  async create(createPostDto: CreatePostDto, userId: string) {
    console.log(createPostDto);

    return await this.postModel.create({ ...createPostDto, userId });
  }

  async findAll(userId: string) {
    return await this.postModel.find({ userId });
  }

  async findOne(id: string) {
    return await this.postModel.findById(id);
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<Post> {
    const post = await this.postModel.findOneAndUpdate(
      { id, userId },
      updatePostDto,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!post) {
      throw new NotFoundException('post not found');
    }

    return post;
  }

  async remove(id: string, userId: string): Promise<Post> {
    const post = await this.postModel.findOneAndDelete({ id, userId });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }
}
