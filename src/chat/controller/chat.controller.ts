import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ChatService } from '../service/chat.service';
import { ChannelInputDto } from '../dto/channel-input.dto';
import { MessageInputDto } from '../dto/message-input.dto';
import { NumberInputDto } from '../dto/number-input.dto';
import { PasswordInputDto } from '../dto/password-input.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createChat(@Req() req, @Body() body: ChannelInputDto): Promise<void> {
    return this.chatService.createChat(req.user.ftLogin, body);
  }

  @Put('channel/:channelId/user/:nickname')
  async addUserToChannel(
    @Req() req,
    @Param('channelId') id: number,
    @Param('nickname') nickname: string,
  ): Promise<void> {
    await this.chatService.addUserToChannel(req.user.ftLogin, id, nickname);
  }

  @Post('channel/:channelId/messages')
  async sendMessageToChannel(
    @Req() req,
    @Param('channelId') channelId: number,
    @Body() messageDto: MessageInputDto,
  ): Promise<void> {
    await this.chatService.sendMessageToChannel(
      req.user.ftLogin,
      channelId,
      messageDto,
    );
  }

  @Post('channel/direct/:nickname/messages')
  async sendDirectMessage(
    @Req() req,
    @Param('nickname') nickname: string,
    @Body() messageDto: MessageInputDto,
  ): Promise<void> {
    await this.chatService.sendDirectMessage(
      req.user.ftLogin,
      nickname,
      messageDto,
    );
  }

  @Patch('channels/:channelId/type')
  async changeChannelType(
    @Req() req,
    @Param('channelId') channelId: number,
    @Body() numberDto: NumberInputDto,
  ): Promise<void> {
    await this.chatService.changeChannelType(
      req.user.ftLogin,
      channelId,
      numberDto.type,
    );
  }

  @Put('channels/:channelId/password')
  async changeChannelPassword(
    @Req() req,
    @Param('channelId') channelId: number,
    @Body() passwordDto: PasswordInputDto,
  ): Promise<void> {
    await this.chatService.changeChannelPassword(
      req.user.ftLogin,
      channelId,
      passwordDto.password,
    );
  }

  @Post('channels/:channelId/login')
  async validateChannelPassword(
    @Req() req,
    @Param('channelId') channelId: number,
    @Body() passwordDto: PasswordInputDto,
  ): Promise<void> {
    await this.chatService.validateChannelPassword(
      req.user.ftLogin,
      channelId,
      passwordDto.password,
    );
  }

  @Get('channels/:channelId/users')
  async getChannelUsers(@Req() req, @Param('channelId') channelId: number) {
    return await this.chatService.getChannelUsers(req.user.ftLogin, channelId);
  }

  @Delete('channels/:channelId/users/:nickname')
  async removeUserFromChannel(
    @Req() req,
    @Param('channelId') channelId: number,
    @Param('nickname') nickname: string,
  ): Promise<void> {
    await this.chatService.removeUserFromChannel(
      req.user.ftLogin,
      channelId,
      nickname,
    );
  }
}
