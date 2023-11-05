import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OTPType, User, UserType } from '@prisma/client';

import {
  ChangeEmail,
  ChangeEmailRequest,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResendEmailVerificationOTPRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from './dtos/auth.dto';
import * as argon from 'argon2';
import { OtpService } from 'src/modules/otp/otp.service';
import { JWT } from 'src/constant';
import { PrismaService } from 'src/common/@services/prisma.service';
import { sendMail } from 'src/common/@helpers/mail';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  // --------------- REGISTER ----------------

  async signup(payload: RegisterRequest) {
    //check user with this email already exists
    const userWithThisEmail = await this.prisma.user.findUnique({
      where: { email: payload.email.toLowerCase() },
    });

    if (userWithThisEmail) {
      throw new BadRequestException('User with this email already exists');
    }

    const userWithPhoneNumber = await this.prisma.user.findUnique({
      where: { phoneNumber: payload.phoneNumber },
    });

    if (userWithPhoneNumber) {
      throw new BadRequestException(
        'User with this phone number already exists',
      );
    }

    const user = await this.prisma.user.create({
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email.toLowerCase(),
        password: await argon.hash(payload.password),
        phoneNumber: payload.phoneNumber,
        companyName: payload.companyName,
      },
    });

    const emailVerificationToken = await this.otpService.createOtp(
      user.id,
      OTPType.EMAIL_VERIFICATION,
    );

    sendMail({
      to: payload.email,
      subject: 'Email verification',
      text: `Hi ${payload.firstName},\n\nYour email verification code is ${emailVerificationToken.code}`,
    });

    delete user.password;
    return {
      message: 'User created successfully',
      user,
    };
  }

  // --------------- LOGIN ----------------

  async login(payload: LoginRequest) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.email.toLowerCase(),
      },
    });

    if (!user)
      throw new BadRequestException({
        is_verified: null,
        message: 'Invalid credentials.',
      });

    if (!user.isVerified) {
      throw new BadRequestException('Please verify your account first.');
    }

    //validate password
    const isPasswordValid = await argon.verify(user.password, payload.password);
    if (!isPasswordValid)
      throw new BadRequestException({
        is_verified: null,
        message: 'Invalid credentials.',
      });

    const token = await this.jwtService.signAsync(
      { sub: user.id },
      {
        expiresIn: JWT.EXPIRES_IN,
        secret: JWT.SECRET,
      },
    );

    return {
      token,
      isVerified: true,
      userType: user.userType,
    };
  }

  // --------------- VERIFY ----------------

  async verifyEmail(payload: VerifyEmailRequest) {
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email.toLowerCase() },
    });

    if (!user) throw new BadRequestException('Invalid information provided.');

    if (user.isVerified)
      throw new BadRequestException('User is already verified.');

    const isValid = await this.otpService.validateOtp(
      user.id,
      payload.otp,
      OTPType.EMAIL_VERIFICATION,
    );

    if (!isValid) throw new BadRequestException('Invalid OTP');

    user.isVerified = true;

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
      },
    });

    await this.otpService.deleteOtp(user.id, OTPType.EMAIL_VERIFICATION);

    return { message: 'Account verified successfully' };
  }

  // --------------- RESEND EMAIL OTP ----------------

  async resendOtp(payload: ResendEmailVerificationOTPRequest) {
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email.toLowerCase() },
    });

    if (!user) throw new NotFoundException('User not found');

    if (user.isVerified)
      throw new BadRequestException('User is already verified.');

    const previousOtp = await this.otpService.findLastOtp(
      user.id,
      OTPType.EMAIL_VERIFICATION,
    );

    if (previousOtp) {
      const waitTime = 1000 * 60 * 1; // resend only after one minute
      const completedWaitTime =
        previousOtp.createdAt.getTime() + waitTime < Date.now();
      if (!completedWaitTime) {
        throw new BadRequestException(
          `Please wait for ${waitTime / 1000} seconds before resending OTP.`,
        );
      }
    }

    // send email with OTP
    const otp = await this.otpService.createOtp(
      user.id,
      OTPType.EMAIL_VERIFICATION,
    );
    sendMail({
      to: user.email,
      subject: 'Email Verification',
      text: `Hi ${user.firstName},\n\nYour email verification code is ${otp.code}`,
    });

    return { message: 'Email verification OTP has been resent.' };
  }

  // --------------- REQUEST CHANGE EMAIL ----------------

  async requestChangeEmail(user: User, payload: ChangeEmailRequest) {
    const emailAvailable = await this.prisma.user.findUnique({
      where: { email: payload.newEmail.toLowerCase() },
    });

    if (emailAvailable) {
      throw new BadRequestException('Email already in use');
    }

    const deletePrevEmailChangeIfExist = this.prisma.emailChange.deleteMany({
      where: { userId: user.id },
    });

    const otp = await this.otpService.createOtp(user.id, OTPType.EMAIL_CHANGE);

    const createEmailChange = this.prisma.emailChange.create({
      data: {
        userId: user.id,
        otp: otp.code,
        newEmail: payload.newEmail,
      },
    });

    await this.prisma.$transaction([
      deletePrevEmailChangeIfExist,
      createEmailChange,
    ]);

    await sendMail({
      to: payload.newEmail,
      subject: 'Change email verification',
      text: `Hi ${user.firstName},\n\nYour change email verification code is ${otp.code}`,
    });
  }

  // --------------- CHANGE EMAIL ----------------

  async changeEmail(payload: ChangeEmail) {
    const emailChange = await this.prisma.emailChange.findUnique({
      where: { otp: payload.otp },
    });

    if (emailChange !== null && emailChange.validUntil > new Date()) {
      await this.prisma.user.update({
        where: { id: emailChange.userId },
        data: {
          email: emailChange.newEmail.toLowerCase(),
        },
        select: null,
      });
      return { message: 'Email changed successfully' };
    } else {
      throw new BadRequestException(
        `Invalid email change otp ${payload.otp} is rejected.`,
      );
    }
  }

  // --------------- CHANGE PASSWORD ----------------

  async changePassword(user: User, payload: ChangePasswordRequest) {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: await argon.hash(payload.newPassword),
      },
      select: null,
    });

    await sendMail({
      to: user.email,
      subject: 'Password changed',
      text: `Hi ${user.firstName},\n\nYour password has been changed successfully.`,
    });

    return { message: 'Password changed successfully' };
  }

  // --------------- FORGET PASSWORD ----------------

  async forgetPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        firstName: true,
        email: true,
      },
    });

    if (user === null) {
      throw new NotFoundException(`User with email ${email} not found.`);
    }

    const deletePrevPasswordResetIfExist = this.prisma.passwordReset.deleteMany(
      {
        where: { userId: user.id },
      },
    );

    const token = await this.otpService.createOtp(
      user.id,
      OTPType.PASSWORD_RESET,
    );

    const createPasswordReset = this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        otp: token.code,
      },
      select: null,
    });

    await this.prisma.$transaction([
      deletePrevPasswordResetIfExist,
      createPasswordReset,
    ]);

    await sendMail({
      to: user.email,
      subject: 'Reset your password',
      text: `Hi ${user.firstName},\n\nYour password reset OTP is ${token.code}`,
    });
  }

  // --------------- RESET PASSWORD ----------------

  async resetPassword(resetPasswordRequest: ResetPasswordRequest) {
    const passwordReset = await this.prisma.passwordReset.findUnique({
      where: { otp: resetPasswordRequest.otp },
    });

    if (passwordReset !== null && passwordReset.validUntil > new Date()) {
      await this.prisma.user.update({
        where: { id: passwordReset.userId },
        data: { password: await argon.hash(resetPasswordRequest.newPassword) },
        select: null,
      });
    } else {
      throw new NotFoundException(
        `Invalid reset password token ${resetPasswordRequest.otp} is rejected`,
      );
    }
  }
}
