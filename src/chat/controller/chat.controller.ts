import { Body, Controller, Param, Post, Put, Req } from '@nestjs/common';
import { ChatService } from '../service/chat.service';
import { ChannelInputDto } from '../dto/channel-input.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createChat(@Req() req, @Body() body: ChannelInputDto): Promise<void> {
    return this.chatService.createChat(req.user.ftLogin, body);
  }

  @Put('channel/:id/user/:nickname')
  async addUserToChannel(
    @Req() req,
    @Param('id') id: number,
    @Param('nickname') nickname: string,
  ): Promise<void> {
    await this.chatService.addUserToChannel(req.user.ftLogin, id, nickname);
  }
}
