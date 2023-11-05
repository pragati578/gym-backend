import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { User, UserType } from '@prisma/client';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserRequest } from './dtos/user.dto';
import { JwtAuthGuard } from 'src/common/@guards/jwt-auth.guard';
import { GetUser } from 'src/common/@decorators/user.decorator';
import { RolesGuard } from 'src/common/@guards/roles.guard';
import { Roles } from 'src/common/@decorators/roles.decorator';
import { getFileName } from 'src/common/@helpers/storage';
import { imageValidator } from 'src/common/@helpers/utils';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get current user details

  @ApiOperation({ summary: 'Get current user details' })
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, description: 'Current user details' })
  async getUsers(@GetUser() user: User) {
    return user;
  }

  // Get all users

  @ApiOperation({ summary: 'Get all users' })
  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserType.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  // get user details

  @ApiOperation({ summary: 'Get user details' })
  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, description: 'User details' })
  async getUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.getUser(id);
  }

  // Update current user

  @ApiOperation({ summary: 'Update current user' })
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: 'static/avatar',
        filename: getFileName,
      }),
      fileFilter: imageValidator,
    }),
  )
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
  })
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRequest: UpdateUserRequest,
    @GetUser() user: User,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (id !== user.id) {
      throw new UnauthorizedException();
    }
    return await this.userService.updateUser(user.id, updateRequest, file);
  }

  // Update a user

  @ApiOperation({ summary: 'Update current user' })
  @ApiBearerAuth('JWT-auth')
  @Patch('admin/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserType.ADMIN)
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: 'static/avatar',
        filename: getFileName,
      }),
      fileFilter: imageValidator,
    }),
  )
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
  })
  async updateAUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRequest: UpdateUserRequest,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.userService.updateUser(id, updateRequest, file);
  }

  // Delete user

  @ApiOperation({ summary: 'Delete a user' })
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @Delete('admin/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully',
  })
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.deleteUser(id);
  }
}
