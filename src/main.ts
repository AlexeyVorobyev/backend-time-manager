import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setupSwagger } from './swagger'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
	require('dotenv').config()
	const app = await NestFactory.create(AppModule)
	await setupSwagger(app)

	app.useGlobalPipes(new ValidationPipe({
		transform: true
	}))

	const configService = app.get(ConfigService)
	const port = configService.get('PORT')

	await app.listen(port, () => {
		console.log(`Application running at ${port}`)
	})
}

bootstrap()
