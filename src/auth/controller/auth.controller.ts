import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { FtOauthGuard } from '../guards/ft.guard';
import { Public } from '../public.decorator';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Public()
  @Get('login')
  @UseGuards(FtOauthGuard)
  async ftAuth(): Promise<void> {}

  @Public()
  @Get('42/callback')
  @UseGuards(FtOauthGuard)
  async ftAuthCallback(@Req() req: any, @Res() res: Response): Promise<void> {
    const accessToken = this.jwtService.sign(
      { req: req.user.username },
      { secret: `${process.env.JWT_SECRET}` },
    );
    console.log(accessToken);
    return res.redirect('http://localhost:5173/?token=' + accessToken);
  }
}
