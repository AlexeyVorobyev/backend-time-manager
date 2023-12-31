import { Module } from '@nestjs/common'
import { AuthService } from './auth.serivce'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/entity/user.entity'
import jwtConfig from '../common/config/jwt.config'
import { BcryptService } from './bcrypt.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync(jwtConfig.asProvider())
  ],
  controllers: [AuthController],
  providers: [AuthService, BcryptService],
  exports: [JwtModule]
})
export class AuthModule {}