import {
  Controller,
  Get,
  HttpStatus,
  Patch,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
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
    await this.authService.ftAuthCallback(req, res);
  }

  @Patch('logout')
  async logout(@Req() req: any, @Res() res: Response): Promise<void> {
    await this.authService.logout(req.user.ftLogin, res);
    res.status(HttpStatus.OK).send();
  }

  @Public()
  @Get('guest')
  async guestAuth(@Res() res: Response): Promise<void> {
    await this.authService.guestAuth(res);
  }
}
