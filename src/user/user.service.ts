import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entity/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
  }

  async getMe(userId: string): Promise<User> {
    console.log(userId)
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      }
    })
    if (!user) {
      throw new BadRequestException('User not found')
    }

    return user
  }
}