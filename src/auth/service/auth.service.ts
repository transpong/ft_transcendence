import { Injectable, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserService } from '../../user/service/user.service';
import { UserEntity } from '../../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async ftAuthCallback(@Req() req: any, @Res() res: Response): Promise<void> {
    const user: UserEntity = await this.userService.getUserByFtId(
      req.user.username,
    );
    const accessToken: string = this.generateJwtToken(user.ftId);

    res.cookie('token', accessToken);
    console.log(accessToken); // TODO: REMOVE THIS DEBUG LOG
    if (req.user.mfa) {
      res.redirect(process.env.FRONTEND_REDIRECT_MFA);
      return;
    }
    if (!user.nickname) {
      res.redirect(process.env.FRONTEND_REDIRECT_NICKNAME);
    } else {
      res.redirect(process.env.FRONTEND_REDIRECT_HOME);
    }
    return;
  }

  async logout(ftLogin: string, @Res() res: Response): Promise<void> {
    await this.userService.logout(ftLogin);
    res.clearCookie('token');
  }

  async guestAuth(@Res() res: Response): Promise<void> {
    const user: UserEntity = await this.userService.newGuestUser();
    const accessToken: string = this.generateJwtToken(user.ftId);

    res.cookie('token', accessToken);
    console.log(accessToken); // TODO: REMOVE THIS DEBUG LOG
    res.redirect(process.env.FRONTEND_REDIRECT_NICKNAME);
    return;
  }

  private generateJwtToken(ftId: any): string {
    return this.jwtService.sign(
      { req: ftId },
      { secret: `${process.env.JWT_SECRET}` },
    );
  }
}
