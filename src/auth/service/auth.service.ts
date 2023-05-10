import { Injectable, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthDto } from '../dto/auth.dto';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  ftAuthCallback(@Req() req: any, @Res() res: Response): void {
    const tempUser: AuthDto = AuthDto.fromJSON(req.user);
    const accessToken: string = this.generateJwtToken(req);

    res.cookie('token', accessToken);
    if (this.userService.userEmptyNickname(tempUser.username)) {
      res.redirect('http://localhost:5173/dashboard');
    } else {
      res.redirect('http://google.com');
    }
    return;
  }

  me(@Req() req: any): any {
    const token = this.deserializeJwtToken(this.getBearerToken(req));
    return token.req;
  }

  generateJwtToken(req: any): string {
    return this.jwtService.sign(
      { req: req.user.username },
      { secret: `${process.env.JWT_SECRET}` },
    );
  }

  deserializeJwtToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: `${process.env.JWT_SECRET}`,
    });
  }

  private getBearerToken(req: any): string {
    return req.headers.authorization.split(' ')[1];
  }
}
