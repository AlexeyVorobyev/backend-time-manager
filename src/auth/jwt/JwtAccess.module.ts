import { JwtModule, JwtService } from '@nestjs/jwt'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
	imports: [JwtModule.registerAsync({
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: (configService: ConfigService) => ({
			secret: configService.get('jwt.accessSecret'),
			signOptions: {
				expiresIn: configService.get('jwt.accessTokenTtl') / 1000
			}
		})
	})],
	providers: [{
		provide: 'JwtAccessService',
		useExisting: JwtService
	}],
	exports: ['JwtAccessService']
})
export class JwtAccessModule {}