import { Module } from '@nestjs/common'
import { DatabaseModule } from './database/database.module'
import { ConfigModule } from '@nestjs/config'
import swaggerConfig from './common/config/swagger.config'
import databaseConfig from './common/config/database.config'
import appConfig from './common/config/app.config'
import { validate } from './common/validation/env.validation'
import { UserModule } from './user/user.module'
import { RedisModule } from './redis/redis.module'
import RedisConfig from './common/config/redis.config'
import JwtConfig from './common/config/jwt.config'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, swaggerConfig, RedisConfig, JwtConfig],
      validate,
    }),
    DatabaseModule,
    RedisModule,
    UserModule,
    AuthModule
  ]
})
export class AppModule {}
