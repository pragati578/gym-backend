import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'new title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'desctiption is here' })
  @IsString()
  @IsOptional()
  content: string;
}
