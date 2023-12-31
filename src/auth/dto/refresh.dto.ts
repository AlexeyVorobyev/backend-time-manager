import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator'


export class RefreshDto {
  @ApiProperty({
    description: 'Refresh Token',
    example: 'token'
  })
  readonly refreshToken: string
}