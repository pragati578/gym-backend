import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/common/@guards/jwt-auth.guard';
import { GetUser } from 'src/common/@decorators/user.decorator';
import { User } from '@prisma/client';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment-dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Post')
@Controller('post')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'Create a new post' })
  @ApiBearerAuth()
  @Post()
  create(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    return this.postService.create(createPostDto, user);
  }

  @ApiOperation({ summary: 'Get all posts' })
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @ApiOperation({ summary: 'Get posts created by the authenticated user' })
  @Get('my-posts')
  getMyPosts(@GetUser() user: User) {
    return this.postService.getMyPosts(user);
  }

  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({ name: 'id', type: 'string' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @ApiOperation({ summary: 'Remove a post' })
  @ApiParam({ name: 'id', type: 'string' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }

  // Comment CRUD

  @ApiOperation({ summary: 'Create a comment on a post' })
  @ApiParam({ name: 'id', type: 'string' })
  @Post(':id/comment')
  createComment(
    @Param('id') id: string,
    @Body() body: CreateCommentDto,
    @GetUser() user: User,
  ) {
    return this.postService.createComment(id, body, user);
  }

  @ApiOperation({ summary: 'Update a comment on a post' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiParam({ name: 'commentId', type: 'string' })
  @Patch(':id/comment/:commentId')
  updateComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Body() body: UpdateCommentDto,
  ) {
    return this.postService.updateComment(id, commentId, body);
  }

  @ApiOperation({ summary: 'Delete a comment on a post' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiParam({ name: 'commentId', type: 'string' })
  @Delete(':id/comment/:commentId')
  deleteComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
  ) {
    return this.postService.deleteComment(id, commentId);
  }
}
