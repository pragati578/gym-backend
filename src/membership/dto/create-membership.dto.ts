import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsOptional, IsString } from 'class-validator';

export class CreateMembershipDto {
  @ApiProperty({ example: 'new title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'desctiption is here' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: 200.0 })
  @IsDecimal({
    decimal_digits: '2',
    force_decimal: true,
    locale: 'en-US',
  })
  price: number;
}
