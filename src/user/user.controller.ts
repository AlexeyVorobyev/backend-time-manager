import { Controller, Get } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOkResponse, ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { UserService } from './user.service'
import { UserEntity } from './entity/user.entity'
import { ActiveUser } from '../common/decorators/active-user.decorator'
import { BaseHttpExceptionDto } from '../common/dto/BaseHttpException.dto'
import { MeResponseDto } from './dto/me-response.dto'


@ApiTags('user')
@Controller('user')
export class UserController {
	constructor(private readonly usersService: UserService) {
	}

	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: BaseHttpExceptionDto
	})
	@ApiOkResponse({ description: 'Get logged in user\'s details', type: MeResponseDto })
	@ApiBearerAuth()
	@ApiOperation({
		summary:'User information endpoint',
		description:'Provides user information.'
	})
	@Get('me')
	async getMe(@ActiveUser('id') userId: string): Promise<MeResponseDto> {
		return this.usersService.getMe(userId)
	}
}