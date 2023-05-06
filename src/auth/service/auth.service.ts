import { Injectable, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  ftAuthCallback(@Req() req: any, @Res() res: Response): void {
    const accessToken: string = this.generateJwtToken(req);
    this.setTokenCookie(res, accessToken);
    res.redirect(`http://localhost:5173/dashboard`);
    return;
  }

  private generateJwtToken(req: any): string {
    return this.jwtService.sign(
      { req: req.user.username },
      { secret: `${process.env.JWT_SECRET}` },
    );
  }

  private setTokenCookie(res: Response, token: string): void {
    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXPIRATION_TIME}`;
    res.cookie('token', cookie);
  }
}
