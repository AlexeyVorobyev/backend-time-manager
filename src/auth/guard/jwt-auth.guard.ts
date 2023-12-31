import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import jwtConfig from '../../common/config/jwt.config'
import { ActiveUserData } from '../../common/interfaces/active-user-data.interface'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject('JwtAccessService')
    private readonly jwtAccessService: JwtService,
    private reflector: Reflector
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass()
    ])
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = this.getToken(request)
    if (!token) {
      throw new UnauthorizedException('Authorization token is required')
    }

    try {
      await this.jwtAccessService.verifyAsync<ActiveUserData>(
        token,
        {
          secret: this.jwtConfiguration.accessSecret
        }
      )
    } catch (error) {
      throw new UnauthorizedException(error.message)
    }

    return true
  }

  private getToken(request: Request) {
    const [_, token] = request.headers.authorization?.split(' ') ?? []
    return token
  }
}