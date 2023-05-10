import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Public } from '../../auth/decorator/public.decorator';
import { Response } from 'express';
import { AvatarService } from '../service/avatar.service';

@Controller('avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Public()
  @Get('img/:name')
  async getUserImage(@Param('name') name: string) {
    return this.avatarService.getImage(name);
  }

  // rota para retornar a imagem do usuário logado utilizando o ftLogin do jwt
  @Get('download')
  async getImageNameFromUser(@Req() req: any): Promise<string> {
    return this.avatarService.getImageFromUser(req.user.ftLogin);
  }
}
