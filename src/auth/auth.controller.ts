import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiOkResponse, ApiOperation,
	ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { Public } from '../common/decorators/public.decorator'
import { SignInDto } from './dto/sign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'
import { AuthService } from './auth.serivce'
import { SignInResponseDto } from './dto/sign-in-response.dto'
import { RefreshDto } from './dto/refresh.dto'
import { RefreshResponseDto } from './dto/refresh-response.dto'
import { ActiveUser } from '../common/decorators/active-user.decorator'
import { BaseHttpExceptionDto } from '../common/dto/BaseHttpException.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}

	@ApiConflictResponse({
		description: 'User already exists',
		type: BaseHttpExceptionDto
	})
	@ApiBadRequestResponse({
		description: 'Return errors for invalid sign up fields',
		type: BaseHttpExceptionDto
	})
	@ApiCreatedResponse({
		description: 'User has been successfully signed up'
	})
	@ApiOperation({
		summary:'Sign-up endpoint',
		description:'Provides functionality of creating new user in system.'
	})
	@Public()
	@Post('sign-up')
	signUp(@Body() signUpDto: SignUpDto): Promise<void> {
		return this.authService.signUp(signUpDto)
	}

	@ApiBadRequestResponse({
		description: 'Return errors for invalid sign in fields'
	})
	@ApiOkResponse({
		description: 'User has been successfully signed in',
		type: SignInResponseDto
	})
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary:'Sign-in endpoint',
		description:'Allows to get JWT Tokens to logged user.'
	})
	@Public()
	@Post('sign-in')
	signIn(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
		return this.authService.signIn(signInDto)
	}

	@ApiBadRequestResponse({
		description: 'Provided refreshToken are invalid or expired',
		type: BaseHttpExceptionDto
	})
	@ApiOkResponse({
		description: 'User successfully received new access and refresh token',
		type: RefreshResponseDto
	})
	@ApiOperation({
		summary:'Refresh JWT tokens endpoint',
		description:'Allows to refresh JWT Tokens to logged user.'
	})
	@Public()
	@Post('refresh')
	refresh(@Body() refreshDto: RefreshDto, @ActiveUser('id') userId: string): Promise<RefreshResponseDto> {
		return this.authService.refresh(refreshDto, userId)
	}

	@ApiUnauthorizedResponse({
		description: 'Provided accessToken are invalid or expired or accessToken not provided',
		type: BaseHttpExceptionDto
	})
	@ApiOkResponse({
		description: 'User successfully authenticated'
	})
	@ApiOperation({
		summary:'Service endpoint for services',
		description:'Allows authentication of user.'
	})
	@HttpCode(HttpStatus.OK)
	@ApiBearerAuth()
	@Post('internal-auth')
	internalAuth(): void {
	}
}