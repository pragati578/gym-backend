import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { UpdateUserRequest } from './dtos/user.dto';
import { PrismaService } from 'src/common/@services/prisma.service';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // --------------- UPDATE CURRENT USER ----------------

  async updateUser(
    user_id: string,
    payload: UpdateUserRequest,
    file?: Express.Multer.File,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    //replace old avatar if exists
    if (payload.avatar) {
      payload.avatar = null;
    }
    if (file) {
      payload.avatar = '/' + file.path;
      if (user.avatar) {
        // delete old avatar
        const path = user.avatar.slice(1);
        fs.unlinkSync(path);
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        ...payload,
      },
    });

    return updatedUser;
  }

  // --------------- GET USER DETAILS ----------------

  async getUser(user_id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
      include: {
        Posts: {
          include: { Comments: true },
        },
        UserMemberShip: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  // --------------- GET ALL USERS ----------------

  async getAllUsers() {
    return await this.prisma.user.findMany({
      include: {
        Posts: {
          include: { Comments: true },
        },
        UserMemberShip: true,
      },
    });
  }

  // --------------- DELETE USER ----------------

  async deleteUser(user_id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.avatar) {
      // delete old avatar
      const path = user.avatar.slice(1);
      fs.unlinkSync(path);
    }

    return await this.prisma.user.delete({
      where: { id: user.id },
    });
  }
}
