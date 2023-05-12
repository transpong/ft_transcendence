import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { TFAGuard } from '../../auth/guards/tfa.guard';
import { Public } from '../../auth/decorator/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
