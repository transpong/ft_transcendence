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
import { ChannelInputDto } from '../dto/input/channel-input.dto';
import { MessageInputDto } from '../dto/input/message-input.dto';
import { TypeInputDto } from '../dto/input/type-input.dto';
import { PasswordInputDto } from '../dto/input/password-input.dto';
import { RestrictionInputDto } from '../dto/input/restriction-input.dto';
import { MessageDirectOutputDto } from '../dto/output/message-direct-output.dto';
import { MessageOutputDto } from '../dto/output/message-output.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createChat(@Req() req, @Body() body: ChannelInputDto): Promise<void> {
    return this.chatService.createChat(req.user.ftLogin, body);
  }

  @Get()
  async getChats(@Req() req) {
    return await this.chatService.getChats(req.user.ftLogin);
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
    @Body() typeDto: TypeInputDto,
  ): Promise<void> {
    await this.chatService.changeChannelType(
      req.user.ftLogin,
      channelId,
      typeDto.type,
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

  @Patch('channels/:channelId/users/:nickname/type')
  async changeUserAccessType(
    @Req() req,
    @Param('channelId') channelId: number,
    @Param('nickname') nickname: string,
    @Body() typeDto: TypeInputDto,
  ): Promise<void> {
    await this.chatService.changeUserAccessType(
      req.user.ftLogin,
      channelId,
      nickname,
      typeDto.type,
    );
  }

  @Patch('channels/:channelId/users/:nickname/restrictions')
  async changeUserRestrictions(
    @Req() req,
    @Param('channelId') channelId: number,
    @Param('nickname') nickname: string,
    @Body() restrictionDto: RestrictionInputDto,
  ): Promise<void> {
    await this.chatService.changeUserRestrictions(
      req.user.ftLogin,
      channelId,
      nickname,
      restrictionDto.restriction,
    );
  }

  @Get('channels/:channelId/messages')
  async getChannelMessages(
    @Req() req,
    @Param('channelId') channelId: number,
  ): Promise<MessageOutputDto[]> {
    return await this.chatService.getChannelMessages(
      req.user.ftLogin,
      channelId,
    );
  }

  @Get('channels/direct/:nickname/messages')
  async getDirectMessages(
    @Req() req,
    @Param('nickname') nickname: string,
  ): Promise<MessageDirectOutputDto> {
    return await this.chatService.getDirectMessages(req.user.ftLogin, nickname);
  }

  @Delete('channels/:channelId/leave')
  async leaveChannel(@Req() req, @Param('channelId') channelId: number) {
    await this.chatService.leaveChannel(req.user.ftLogin, channelId);
  }
}
