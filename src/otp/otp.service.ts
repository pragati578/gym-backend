import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OTPType } from '@prisma/client';
import { generateOTP } from 'src/common/@helpers/utils';
import { PrismaService } from 'src/common/@services/prisma.service';

@Injectable()
export class OtpService {
  constructor(private readonly prismaService: PrismaService) {}

  async createOtp(userId: string, type: OTPType) {
    // delete previous OTP if exists
    const otp = await this.prismaService.otp.findFirst({
      where: { userId, type },
    });

    if (otp) {
      await this.prismaService.otp.delete({
        where: { userId_type: { userId, type } },
      });
    }

    return await this.prismaService.otp.create({
      data: {
        code: await generateOTP(6), // generate random 6 digit code
        userId,
        type,
      },
    });
  }

  async deleteOtp(userId: string, type: OTPType) {
    return this.prismaService.otp.delete({
      where: {
        userId_type: {
          userId,
          type,
        },
      },
    });
  }

  async validateOtp(userId: string, code: string, type: OTPType) {
    // OTP is valid for 15 minutes only
    const expiryTime = 1000 * 60 * 15;

    const otp = await this.prismaService.otp.findFirst({
      where: { userId, code, type },
    });
    if (!otp) throw new NotFoundException('Invalid OTP');

    if (otp.createdAt.getTime() + expiryTime < Date.now()) {
      throw new BadRequestException('OTP has expired!');
    }

    return true;
  }

  async findLastOtp(userId: string, type: OTPType) {
    return await this.prismaService.otp.findFirst({
      where: { userId, type },
      orderBy: { createdAt: 'desc' },
    });
  }
}
