import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator'


export class SignInDto {
	@ApiProperty({
		description: 'Email of user',
		example: 'atest@email.com'
	})
	@IsEmail()
	@IsNotEmpty()
	readonly email: string

	@ApiProperty({
		description: 'Password of user',
		example: 'Pass#123'
	})
	@IsNotEmpty()
	readonly password: string
}