import { AuthGuard } from '@nestjs/passport';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class FtOauthGuard extends AuthGuard('42') {
  handleRequest(err, user, info, context, status) {
    if (err) {
      throw new HttpException(
        {
          status: status,
          error: 'Falha na autenticação',
        },
        status,
      );
    }
    return user;
  }
}
