import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { UserProfileDto } from '../dto/user-profile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getUserInfo(@Req() req): Promise<UserDto> {
    return this.userService.getUserInfo(req.user.ftLogin);
  }

  @Post('me/mfa')
  async generateMfaSecret(@Req() req) {
    return this.userService.generateMfaSecret(req.user.ftLogin);
  }

  @Public()
  @UseGuards(TFAGuard)
  @Post('me/mfa/validate')
  async validateMfaSecret(@Req() req, @Body() body): Promise<void> {
    return this.userService.validateMfaSecret(req.user.ftLogin, body.code);
  }

  @Patch('me/mfa/invalidate')
  async invalidateMfaSecret(@Req() req): Promise<void> {
    return this.userService.invalidateMfaSecret(req.user.ftLogin);
  }

  @Patch('me/nickname')
  async updateNickname(@Req() req, @Body() body): Promise<void> {
    return this.userService.updateNickname(req.user.ftLogin, body.nickname);
  }

  @Patch('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @Req() req,
    @UploadedFile(AvatarPipe)
    file: Express.Multer.File,
  ): Promise<void> {
    return this.userService.updateAvatar(req.user.ftLogin, file);
  }

  @Post('profiles/:nickname/friends')
  async addFriend(
    @Req() req,
    @Param('nickname') nickname: string,
  ): Promise<void> {
    return this.userService.addFriend(req.user.ftLogin, nickname);
  }

  @Delete('profiles/:nickname/friends')
  async removeFriend(
    @Req() req,
    @Param('nickname') nickname: string,
  ): Promise<void> {
    return this.userService.removeFriend(req.user.ftLogin, nickname);
  }

  @Post('profiles/:nickname/block')
  async blockUser(
    @Req() req,
    @Param('nickname') nickname: string,
  ): Promise<void> {
    return this.userService.blockUser(req.user.ftLogin, nickname);
  }

  @Delete('profiles/:nickname/block')
  async unblockUser(
    @Req() req,
    @Param('nickname') nickname: string,
  ): Promise<void> {
    return this.userService.unblockUser(req.user.ftLogin, nickname);
  }

  @Get('profiles/:nickname')
  async getUserProfile(
    @Req() req,
    @Param('nickname') nickname: string,
  ): Promise<UserProfileDto> {
    return this.userService.getProfile(req.user.ftLogin, nickname);
  }
}
