import { JwtModule, JwtService } from '@nestjs/jwt'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
	imports: [JwtModule.registerAsync({
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: (configService: ConfigService) => ({
			secret: configService.get('jwt.refreshSecret'),
			signOptions: {
				expiresIn: configService.get('jwt.refreshTokenTtl') / 1000
			}
		})
	})],
	providers: [{
		provide: 'JwtRefreshService',
		useExisting: JwtService
	}],
	exports: ['JwtRefreshService']
})
export class JwtRefreshModule {}