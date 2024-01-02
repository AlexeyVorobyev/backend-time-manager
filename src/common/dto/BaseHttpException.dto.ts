import { ApiProperty } from '@nestjs/swagger'

export class BaseHttpExceptionDto {
	@ApiProperty()
	message: any

	@ApiProperty()
	error: string

	@ApiProperty()
	statusCode: number
}