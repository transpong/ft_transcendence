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

  async ftAuthCallback(@Req() req: any, @Res() res: Response): Promise<void> {
    const tempUser: AuthDto = AuthDto.fromJSON(req.user); // TODO: simplify this
    const accessToken: string = this.generateJwtToken(req);

    res.cookie('token', accessToken);
    console.log(accessToken);
    if (tempUser.hasTwoFactor) {
      res.redirect(process.env.FRONTEND_REDIRECT_MFA);
      return;
    }

    if (await this.userService.userHasEmptyNickname(tempUser.username)) {
      res.redirect(process.env.FRONTEND_REDIRECT_NICKNAME);
    } else {
      res.redirect(process.env.FRONTEND_REDIRECT_HOME);
    }
    return;
  }

  private generateJwtToken(req: any): string {
    return this.jwtService.sign(
      { req: req.user.username },
      { secret: `${process.env.JWT_SECRET}` },
    );
  }
}
