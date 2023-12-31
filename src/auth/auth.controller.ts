import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger'
import { Public } from '../common/decorators/public.decorator'
import { SignInDto } from './dto/sign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'
import { AuthService } from './auth.serivce'
import { SignInResponseDto } from './dto/sign-in-response.dto'
import { RefreshDto } from './dto/refresh.dto'
import { RefreshResponseDto } from './dto/refresh-response.dto'
import { ActiveUser } from '../common/decorators/active-user.decorator'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @ApiConflictResponse({
    description: 'User already exists'
  })
  @ApiBadRequestResponse({
    description: 'Return errors for invalid sign up fields'
  })
  @ApiCreatedResponse({
    description: 'User has been successfully signed up'
  })
  @Public()
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    return this.authService.signUp(signUpDto)
  }

  @ApiBadRequestResponse({
    description: 'Return errors for invalid sign in fields'
  })
  @ApiOkResponse({ description: 'User has been successfully signed in' })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInDto)
  }

  @ApiOkResponse({ description: 'User successfully received new access and refresh token' })
  @Public()
  @Post('refresh')
  refresh(@Body() refreshDto: RefreshDto): Promise<RefreshResponseDto> {
    return this.authService.refresh(refreshDto, userId)
  }

}