import { BadRequestException, ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { randomUUID } from 'crypto'
import { Repository } from 'typeorm'
import jwtConfig from '../common/config/jwt.config'
import { ActiveUserData } from '../common/interfaces/active-user-data.interface'
import { BcryptService } from './bcrypt.service'
import { SignInDto } from './dto/sign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'
import { UserEntity } from '../user/entity/user.entity'
import { SignInResponseDto } from './dto/sign-in-response.dto'
import { Builder } from 'builder-pattern'
import { RefreshDto } from './dto/refresh.dto'
import { RefreshResponseDto } from './dto/refresh-response.dto'
import { PostgreSQLErrorCodeEnum } from '../common/enums/PostgreSQLErrorCode.enum'

@Injectable()
export class AuthService {
	constructor(
		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
		private readonly bcryptService: BcryptService,
		@Inject('JwtAccessService')
		private readonly jwtAccessService: JwtService,
		@Inject('JwtRefreshService')
		private readonly jwtRefreshService: JwtService,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {
	}

	async signUp(signUpDto: SignUpDto): Promise<void> {
		try {
			const userBuilder = Builder(UserEntity)

			userBuilder
				.email(signUpDto.email)
				.password(await this.bcryptService.hash(signUpDto.password))

			await this.userRepository.save(userBuilder.build())
		} catch (error) {
			if (error.code === PostgreSQLErrorCodeEnum.UniqueViolation) {
				throw new ConflictException(`User [${signUpDto.email}] already exist`)
			}
			throw error
		}
	}

	async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
		const { email, password } = signInDto

		const user = await this.userRepository.findOne({
			where: {
				email
			}
		})
		if (!user) {
			throw new BadRequestException('Invalid email')
		}

		const isPasswordMatch = await this.bcryptService.compare(
			password,
			user.password
		)
		if (!isPasswordMatch) {
			throw new BadRequestException('Invalid password')
		}

		const SignInResponseBuilder = Builder(SignInResponseDto)

		SignInResponseBuilder
			.accessToken(await this.generateAccessToken(user))
			.accessTokenTTL(new Date(new Date().valueOf() + this.jwtConfiguration.accessTokenTtl))
			.refreshToken(await this.generateRefreshToken(user))
			.refreshTokenTTL(new Date(new Date().valueOf() + this.jwtConfiguration.refreshTokenTtl))

		return SignInResponseBuilder.build()
	}

	async refresh(refreshDto: RefreshDto, userId: string): Promise<RefreshResponseDto> {
		try {
			await this.jwtRefreshService.verifyAsync<ActiveUserData>(
				refreshDto.refreshToken,
				{
					secret: this.jwtConfiguration.refreshSecret
				}
			)
		} catch (error) {
			throw new BadRequestException(error.message)
		}

		const user = await this.userRepository.findOne({
			where: {
				id: userId
			}
		})
		if (!user) {
			throw new BadRequestException('Invalid userId')
		}

		const RefreshResponseBuilder = Builder(RefreshResponseDto)

		RefreshResponseBuilder
			.accessToken(await this.generateAccessToken(user))
			.accessTokenTTL(new Date(new Date().valueOf() + this.jwtConfiguration.accessTokenTtl))
			.refreshToken(await this.generateRefreshToken(user))
			.refreshTokenTTL(new Date(new Date().valueOf() + this.jwtConfiguration.refreshTokenTtl))

		return RefreshResponseBuilder.build()
	}

	async generateRefreshToken(
		user: Partial<UserEntity>
	): Promise<string> {
		const tokenId = randomUUID()

		return await this.jwtRefreshService.signAsync(
			{
				id: user.id,
				email: user.email,
				tokenId
			} as ActiveUserData
		)
	}

	async generateAccessToken(
		user: Partial<UserEntity>
	): Promise<string> {
		const tokenId = randomUUID()

		return await this.jwtAccessService.signAsync(
			{
				id: user.id,
				email: user.email,
				tokenId
			} as ActiveUserData
		)
	}
}