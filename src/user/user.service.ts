import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from './entity/user.entity'
import { MeResponseDto } from './dto/me-response.dto'
import { Builder } from 'builder-pattern'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {
	}

	async getMe(userId: string): Promise<MeResponseDto> {
		console.log(userId)
		const user = await this.userRepository.findOne({
			where: {
				id: userId
			}
		})
		if (!user) {
			throw new BadRequestException('User not found')
		}

		const MeResponseDtoBuilder = Builder(MeResponseDto)

		MeResponseDtoBuilder
			.id(user.id)
			.email(user.email)
			.createdAt(user.createdAt)
			.updatedAt(user.updatedAt)

		return MeResponseDtoBuilder.build()
	}
}