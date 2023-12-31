import { IsNotEmpty } from 'class-validator'

export class SignInResponseDto {
  @IsNotEmpty()
  readonly accessToken: string
  @IsNotEmpty()
  readonly accessTokenTTL:Date
  @IsNotEmpty()
  readonly refreshToken: string
  @IsNotEmpty()
  readonly refreshTokenTTL:Date
}