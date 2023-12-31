import { Inject, Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'
import { IO_REDIS_KEY } from '../common/constants'

@Injectable()
export class RedisService {
  constructor(
    @Inject(IO_REDIS_KEY)
    private readonly redisClient: Redis
  ) {
  }

  async getKeys(pattern?: string): Promise<string[]> {
    return await this.redisClient.keys(pattern)
  }

  async insert(key: string, value: string | number): Promise<void> {
    await this.redisClient.set(key, value)
  }

  async get(key: string): Promise<string> {
    return this.redisClient.get(key)
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key)
  }

  async validate(key: string, value: string): Promise<boolean> {
    const storedValue = await this.redisClient.get(key)
    return storedValue === value
  }
}