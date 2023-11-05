import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateUserRequest {
  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsNotEmpty()
  @Matches(/^[A-Za-zıöüçğşİÖÜÇĞŞñÑáéíóúÁÉÍÓÚ]+$/)
  @MaxLength(20)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsNotEmpty()
  @Matches(/^[A-Za-zıöüçğşİÖÜÇĞŞñÑáéíóúÁÉÍÓÚ]+$/)
  @MaxLength(20)
  lastName?: string;

  @ApiPropertyOptional({ example: '+9771234567890' })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  avatar?: any;

  @ApiPropertyOptional({ example: 'Internsathi' })
  @IsNotEmpty()
  @IsOptional()
  @Matches(/^[A-Za-zıöüçğşİÖÜÇĞŞñÑáéíóúÁÉÍÓÚ ]+$/)
  @MaxLength(20)
  companyName: string;
}
