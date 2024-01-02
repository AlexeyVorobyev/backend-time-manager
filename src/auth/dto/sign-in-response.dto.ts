import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SignInResponseDto {
	@ApiProperty({
		description: 'Access JWT token',
	})
	@IsNotEmpty()
	readonly accessToken: string

	@ApiProperty({
		description: 'Date, when access token will expire',
	})
	@IsNotEmpty()
	readonly accessTokenTTL: Date

	@ApiProperty({
		description: 'Refresh JWT token',
	})
	@IsNotEmpty()
	readonly refreshToken: string

	@ApiProperty({
		description: 'Date, when refresh token will expire',
	})
	@IsNotEmpty()
	readonly refreshTokenTTL: Date
}