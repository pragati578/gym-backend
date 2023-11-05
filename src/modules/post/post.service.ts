import { Comments } from '.pnpm/@prisma+client@5.5.2_prisma@5.5.2/node_modules/.prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/common/@services/prisma.service';
import { User } from '@prisma/client';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment-dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, user: User) {
    await this.prisma.posts.create({
      data: {
        ...createPostDto,
        userId: user.id,
      },
    });
  }

  async findAll() {
    return await this.prisma.posts.findMany();
  }

  async getMyPosts(user: User) {
    return await this.prisma.posts.findMany({
      where: { userId: user.id },
      include: { Comments: true },
    });
  }

  async findOne(id: string) {
    const data = await this.prisma.posts.findUnique({
      where: { id },
      include: { Comments: true },
    });

    if (!data) {
      throw new BadRequestException('Post not found');
    }

    return data;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    await this.findOne(id);

    return await this.prisma.posts.update({
      where: { id },
      data: {
        ...updatePostDto,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.prisma.posts.delete({
      where: { id },
    });
  }

  async createComment(id: string, body: CreateCommentDto, user: User) {
    return await this.prisma.comments.create({
      data: {
        ...body,
        postId: id,
        userId: user.id,
      },
    });
  }

  async updateComment(id: string, commentId: string, body: UpdateCommentDto) {
    const comment = await this.prisma.comments.findUnique({
      where: { id },
    });

    if (comment) {
      throw new BadRequestException('Comment already exists');
    }

    return await this.prisma.comments.update({
      where: { id: commentId },
      data: {
        ...body,
      },
    });
  }

  async deleteComment(id: string, commentId: string) {
    const comment = await this.prisma.comments.findUnique({
      where: { id },
    });

    if (comment) {
      throw new BadRequestException('Comment already exists');
    }
    return await this.prisma.comments.delete({
      where: { id: commentId },
    });
  }
}
