import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { FtOauthGuard } from '../guards/ft.guard';

@Controller('auth')
export class AuthController {
  @Get('42')
  @UseGuards(FtOauthGuard)
  async ftAuth(@Req() req: any, @Res() response: Response): Promise<void> {
    console.log('Req :', req);
    console.log('Res :', response);
    return;
  }

  @Get('42/callback')
  @UseGuards(FtOauthGuard)
  @Redirect('/')
  async ftAuthCallback(
    @Req() req: any,
    @Res() response: Response,
  ): Promise<void> {
    console.log('ftAuthCallback called');
    console.log('Req :', req);
    console.log('Res :', response);
    return;
  }
}
