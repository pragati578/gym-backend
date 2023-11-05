import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterRequest {
  @ApiProperty({ example: 'johnwick@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: '+9771234567890' })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsOptional()
  @Matches(/^[a-zA-Z]+$/, {
    message: 'First name must contain only letters',
  })
  @IsString()
  @MaxLength(20)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsOptional()
  @Matches(/^[a-zA-Z]+$/, {
    message: 'Last name must contain only letters',
  })
  @IsString()
  @MaxLength(20)
  lastName: string;

  @ApiProperty({ example: 'Internsathi' })
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(20)
  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Company name must contain only letters and numbers',
  })
  companyName: string;
}

export class LoginRequest {
  @ApiProperty({ example: 'johnwick@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class ChangeEmailRequest {
  @ApiProperty({ example: 'newemail@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  newEmail: string;
}

export class ChangePasswordRequest {
  @ApiProperty({ example: 'newpassword123' })
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}

export class VerifyEmailRequest {
  @ApiProperty({ example: 'johnwick@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  otp: string;
}

export class ChangeEmail {
  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  otp: string;
}

export class ResetPasswordRequest {
  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  otp: string;

  @ApiProperty({ example: 'newpassword123' })
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}

export class ResendEmailVerificationOTPRequest {
  @ApiProperty({ example: 'johnwick@gmail.com' })
  @IsEmail()
  email: string;
}
