import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { FortyTwoUser } from '../user.interface';
import { AuthService } from '../service/auth.service';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.FORTYTWO_CLIENT_ID,
      clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
      callbackURL: process.env.AUTH_CALLBACK,
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: FortyTwoUser,
  ): FortyTwoUser {
    return profile;
  }
}
