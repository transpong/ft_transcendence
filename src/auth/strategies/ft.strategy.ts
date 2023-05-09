import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthDto } from '../dto/auth.dto';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      clientID: process.env.FORTYTWO_CLIENT_ID,
      clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
      callbackURL: process.env.AUTH_CALLBACK,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile) {
    const { login, image } = profile._json;
    const authDto: AuthDto = AuthDto.fromJSON(profile._json);

    if (!(await this.userService.userExists(authDto.username))) {
      this.userService.createUser(authDto).then((r) => console.log(r));
    }

    return {
      username: login,
      image: image.link,
      accessToken,
    };
  }
}
