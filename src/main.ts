import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setupSwagger } from './swagger'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  require('dotenv').config()
  const app = await NestFactory.create(AppModule)
  await setupSwagger(app)

  const configService = app.get(ConfigService)
  const port = configService.get('PORT')

  await app.listen(port, () => {
    console.log(`Application running at ${port}`)
  })
}

bootstrap()
