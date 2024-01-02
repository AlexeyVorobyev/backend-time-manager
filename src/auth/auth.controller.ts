import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiOkResponse,
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
	@HttpCode(HttpStatus.OK)
	@ApiBearerAuth()
	@Post('internal-auth')
	internalAuth(): void {
	}
}