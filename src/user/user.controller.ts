import { Controller, Get } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { UserService } from './user.service'
import { User } from './entity/user.entity'
import { ActiveUser } from '../common/decorators/active-user.decorator'


@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ description: 'Get logged in user\'s details', type: User })
  @ApiBearerAuth()
  @Get('me')
  async getMe(@ActiveUser('id') userId: string): Promise<User> {
    return this.usersService.getMe(userId)
  }
}