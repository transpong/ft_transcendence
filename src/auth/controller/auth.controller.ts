import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { FtOauthGuard } from '../guards/ft.guard';
import { Response } from 'express';
import { AuthService } from '../service/auth.service';
import { Public } from '../decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('42/callback')
  @UseGuards(FtOauthGuard)
  async ftAuthCallback(@Req() req: any, @Res() res: Response): Promise<void> {
    this.authService.ftAuthCallback(req, res);
  }

  // temp route to test auth this route return user info from jwt token
  @Get('me')
  async me(@Req() req: any): Promise<any> {
    return this.authService.me(req);
  }
}
