import { Body, Controller, Post, Req } from '@nestjs/common';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('me/mfa')
  async generateMfaSecret(@Req() req) {
    return this.userService.generateMfaSecret(req.user.ft_id);
  }

  @Post('me/mfa/validate')
  async validateMfaSecret(@Req() req, @Body() body) {
    return this.userService.validateMfaSecret(req.user.ft_id, body.mfa_token);
  }
}
