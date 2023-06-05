import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../../auth/decorator/public.decorator';
import { AvatarService } from '../service/avatar.service';

@Controller('avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Public()
  @Get('img/:name')
  async getUserImage(@Param('name') name: string) {
    return this.avatarService.getImage(name);
  }
}
