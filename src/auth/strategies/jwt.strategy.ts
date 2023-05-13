import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/service/user.service';
import { UserEntity } from '../../user/entity/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<any> {
    if (payload === null) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user: UserEntity = await this.userService.getUserByFtId(payload.req);
    if (!user.twoFactorValid()) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Two-factor authentication required',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return { ftLogin: payload.req };
  }
}
