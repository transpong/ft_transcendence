import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/service/user.service';

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
    // VERIFICAÇÃO EXTRA DE SEGURANÇA PARA VERIFICAR SE O USUÁRIO EXISTE NO BANCO DE DADOS
    // if ((await this.userService.userExists(payload.req)) === false) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.UNAUTHORIZED,
    //       error: 'Unauthorized',
    //     },
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }
    return { ftLogin: payload.req };
  }
}
