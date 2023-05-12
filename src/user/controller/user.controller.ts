import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { TFAGuard } from '../../auth/guards/tfa.guard';
import { Public } from '../../auth/decorator/public.decorator';
import { AvatarPipe } from '../pipe/avatar.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDto } from '../dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getUserInfo(@Req() req): Promise<UserDto> {
    return this.userService.getUserInfo(req.user.ft_id);
  }
  @Post('me/mfa')
  async generateMfaSecret(@Req() req) {
    return this.userService.generateMfaSecret(req.user.ft_id);
  }

  @Public()
  @UseGuards(TFAGuard)
  @Post('me/mfa/validate')
  async validateMfaSecret(@Req() req, @Body() body): Promise<void> {
    return this.userService.validateMfaSecret(req.user.ft_id, body.code);
  }

  @Patch('me/mfa/invalidate')
  async invalidateMfaSecret(@Req() req): Promise<void> {
    return this.userService.invalidateMfaSecret(req.user.ft_id);
  }

  @Patch('me/nickname')
  async updateNickname(@Req() req, @Body() body): Promise<void> {
    return this.userService.updateNickname(req.user.ft_id, body.nickname);
  }

  @Patch('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @Req() req,
    @UploadedFile(AvatarPipe)
    file: Express.Multer.File,
  ): Promise<void> {
    return this.userService.updateAvatar(req.user.ft_id, file);
  }
}
