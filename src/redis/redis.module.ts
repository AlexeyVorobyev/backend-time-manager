import { Global, Module, OnApplicationShutdown } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ModuleRef } from '@nestjs/core'
import { Redis } from 'ioredis'

import { RedisService } from './redis.service'
import { IO_REDIS_KEY } from '../common/constants'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: IO_REDIS_KEY,
      useFactory: async (configService: ConfigService) => {
        return new Redis(configService.get('redis'))
      },
      inject: [ConfigService]
    },
    RedisService
  ],
  exports: [RedisService]
})
export class RedisModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {
  }

  async onApplicationShutdown(signal?: string): Promise<void> {
    return new Promise<void>((resolve) => {
      const redis = this.moduleRef.get(IO_REDIS_KEY)
      redis.quit()
      redis.on('end', () => {
        resolve()
      })
    })
  }
}