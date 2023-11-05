import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import {
  RegisterRequest,
  LoginRequest,
  ChangeEmailRequest,
  ChangePasswordRequest,
  ResetPasswordRequest,
  ResendEmailVerificationOTPRequest,
  VerifyEmailRequest,
  ChangeEmail,
} from './dtos/auth.dto';
import { JwtAuthGuard } from 'src/common/@guards/jwt-auth.guard';
import { GetUser } from 'src/common/@decorators/user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User registration' })
  @ApiConsumes('application/json')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
  })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() payload: RegisterRequest) {
    return await this.authService.signup(payload);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiConsumes('application/json')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged in successfully',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() payload: LoginRequest) {
    return await this.authService.login(payload);
  }

  @ApiOperation({ summary: 'Verify email using OTP' })
  @ApiConsumes('application/json')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verified successfully',
  })
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() payload: VerifyEmailRequest) {
    return await this.authService.verifyEmail(payload);
  }

  @ApiOperation({ summary: 'Resend email verification OTP' })
  @ApiConsumes('application/json')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP resent successfully',
  })
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOtp(@Body() payload: ResendEmailVerificationOTPRequest) {
    return await this.authService.resendOtp(payload);
  }

  @ApiOperation({ summary: 'Request change of email' })
  @ApiConsumes('application/json')
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Change email request sent successfully',
  })
  @Post('change-email/request')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async requestChangeEmail(
    @GetUser() user: User,
    @Body() payload: ChangeEmailRequest,
  ) {
    return await this.authService.requestChangeEmail(user, payload);
  }

  @ApiOperation({ summary: 'Change email' })
  @ApiConsumes('application/json')
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email changed successfully',
  })
  @Post('change-email')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changeEmail(@Body() payload: ChangeEmail) {
    return await this.authService.changeEmail(payload);
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiConsumes('application/json')
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password changed successfully',
  })
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() payload: ChangePasswordRequest,
    @GetUser() user: User,
  ) {
    return await this.authService.changePassword(user, payload);
  }

  @ApiOperation({ summary: 'Forgot password' })
  @ApiConsumes('application/json')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset OTP sent successfully',
  })
  @Post('forgot-password/:email')
  @HttpCode(HttpStatus.OK)
  async forgetPassword(@Param('email') email: string) {
    return await this.authService.forgetPassword(email);
  }

  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiConsumes('application/json')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset successfully',
  })
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() payload: ResetPasswordRequest) {
    return await this.authService.resetPassword(payload);
  }
}
