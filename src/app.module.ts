import { Module } from '@nestjs/common'
import { DatabaseModule } from './database/database.module'
import { ConfigModule } from '@nestjs/config'
import swaggerConfig from './common/config/swagger.config'
import databaseConfig from './common/config/database.config'
import appConfig from './common/config/app.config'
import { validate } from './common/validation/env.validation'
import { UserModule } from './user/user.module'
import JwtConfig from './common/config/jwt.config'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, swaggerConfig, JwtConfig],
      validate,
    }),
    DatabaseModule,
    UserModule,
    AuthModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
