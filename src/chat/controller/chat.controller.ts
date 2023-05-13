import { Body, Controller, Post, Req } from '@nestjs/common';
import { ChatService } from '../service/chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createChat(@Req() req, @Body() body): Promise<void> {
    return this.chatService.createChat(req.user.ftLogin, body.password);
  }
}
