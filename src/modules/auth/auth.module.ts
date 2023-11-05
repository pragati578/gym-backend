import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/common/@services/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from 'src/modules/otp/otp.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService, OtpService],
})
export class AuthModule {}
