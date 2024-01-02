import { ApiProperty } from '@nestjs/swagger'


export class RefreshDto {
	@ApiProperty({
		description: 'Refresh Token',
		example: 'token'
	})
	readonly refreshToken: string
}