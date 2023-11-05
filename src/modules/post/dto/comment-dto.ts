import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'new comment' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
