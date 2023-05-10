import { Controller, Get, Param, Res } from '@nestjs/common';
import { Public } from '../../auth/decorator/public.decorator';
import { Response } from 'express';
import { ImageService } from '../service/image.service';

@Controller('user')
export class UserController {
  constructor(private readonly imageService: ImageService) {}

  @Public()
  @Get('image/:name')
  async getUserImage(
    @Param('name') name: string,
    @Res() res: Response,
  ): Promise<void> {
    this.imageService.getImage(name, res);
  }
}
