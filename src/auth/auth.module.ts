import { Module } from '@nestjs/common'
import { AuthService } from './auth.serivce'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../user/entity/user.entity'
import { BcryptService } from './bcrypt.service'
import { JwtAccessModule } from './jwt/JwtAccess.module'
import { JwtRefreshModule } from './jwt/JwtRefresh.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity]),
		JwtAccessModule,
		JwtRefreshModule
	],
	controllers: [AuthController],
	providers: [AuthService, BcryptService],
	exports: [JwtAccessModule, JwtRefreshModule]
})
export class AuthModule {}