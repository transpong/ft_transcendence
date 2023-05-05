import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: any): any {
    if (payload === null) {
      throw new HttpException(
        { status: HttpStatus.UNAUTHORIZED, error: 'Unauthorized' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return { userId: payload.sub, username: payload.username };
  }
}
