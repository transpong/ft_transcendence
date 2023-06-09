import { AxiosInstance } from "axios";
import { apiService } from "./api";
import { IUserProfile } from "./users-service";

export interface IChatList {
  channels: IChannelChat[];
  other_channels: IChannelChat[];
  friends: IUserProfile[];
  other_users: IUserProfile[];
}

export interface IChannelChat {
  id: number;
  name: string;
  type: ChannelAccessType;
  user_access_type: UserAccessType;
  banned_at: Date;
  kicked_at: Date;
  muted_until: Date;
}

export enum UserAccessType {
  ADMIN = 0,
  MEMBER = 1,
  OWNER = 3,
  BANNED = 4,
  KICKED = 5,
  MUTED = 6,
  BLOCKED = 7,
}

export enum ChannelAccessType {
  PUBLIC = 0,
  PRIVATE = 1,
  PROTECTED = 2,
}

export interface IApiDirectMessagesList {
  user: IApiSender;
  messages: IMessage[];
}

export interface IApiSender {
  id: number;
  ft_id: string;
  nickname: string;
  avatar: string;
  status: number;
}

export interface IMessage {
  id: number;
  created_at: Date;
  message_text: string;
  sender?: IApiSender;
  am_i_sender: boolean;
}

interface IChatToCreate {
  name: string;
  password?: string;
  type: number;
}

export interface IApiChannelUsers {
  id: number;
  ft_id: string;
  nickname: string;
  avatar: string;
  status: number;
  banned_at?: Date;
  kicked_at?: Date;
  muted_until?: Date;
  user_access_type: UserAccessType;
}

export enum UserAccessRestrictions {
  BLOCK = "block",
  UNBLOCK = "unblock",
  KICK = "kick",
  UNKICK = "unkick",
  MUTE = "mute",
  UNMUTE = "unmute",
}


export class ChatService {
  private api: AxiosInstance;
  constructor() {
    this.api = apiService.getAxios();
  }

  async getChats(): Promise<IChatList> {
    const { data } = await this.api.get<IChatList>("/chat");
    return data;
  }

  async getDirectMessages(nickname: string): Promise<IApiDirectMessagesList> {
    const { data } = await this.api.get<IApiDirectMessagesList>(`/chat/channels/direct/${nickname}/messages`);
    return data;
  }

  async sendDirectMessages(nickname: string, message: string): Promise<void> {
    try {
      await this.api.post(`/chat/channel/direct/${nickname}/messages`, { message });
    } catch {}
  }

  async createChannel(chat: IChatToCreate): Promise<boolean> {
    try {
      await this.api.post(`/chat`, chat);
      return true;
    } catch {
      return false;
    }
  }

  async sendChannelMessages(chatId: number, message: string): Promise<void> {
    try {
      await this.api.post(`/chat/channel/${chatId}/messages`, { message });
    } catch {}
  }

  async getChannelMessages(id: number): Promise<IMessage[]> {
    try {
      const { data } = await this.api.get<IMessage[]>(`/chat/channels/${id}/messages`);
      return data;
    } catch {
      return []
    }
  }

  async updateChannelType(chatId: number, type: ChannelAccessType): Promise<boolean> {
    try {
      await this.api.patch(`/chat/channels/${chatId}/type`, { type });
      return true;
    } catch {
      return false;
    }
  }

  async updateChannelPassword(chatId: number, password: string): Promise<boolean> {
    try {
      await this.api.put(`/chat/channels/${chatId}/password`, { password });
      return true;
    } catch {
      return false;
    }
  }

  async verifyChannelPassword(chatId: number, password: string): Promise<boolean> {
    try {
      await this.api.post(`/chat/channels/${chatId}/login`, { password });
      return true;
    } catch {
      return false;
    }
  }

  async getChannelUsers(id: number): Promise<IApiChannelUsers[]> {
    try {
      const { data } = await this.api.get<IApiChannelUsers[]>(`/chat/channels/${id}/users`);
      return data;
    } catch {
      return []
    }
  }

  async addChannelUsers(id: number, nickname: string): Promise<IApiChannelUsers[]> {
    try {
      const { data } = await this.api.put<IApiChannelUsers[]>(
        `/chat/channel/${id}/user/${nickname}`
      );
      return data;
    } catch {
      return []
    }
  }

  async updateUserChannelType(chatId: number, nickname: string, type: UserAccessType): Promise<boolean> {
    try {
      await this.api.patch(`/chat/channels/${chatId}/users/${nickname}/type`, { type });
      return true;
    } catch {
      return false;
    }
  }

  async updateUserChannelRestrictions(chatId: number, nickname: string, restriction: UserAccessRestrictions): Promise<void> {
    try {
      await this.api.patch(`/chat/channels/${chatId}/users/${nickname}/restrictions`, { restriction });
    } catch {}
  }

  async leaveChannel(chatId: number): Promise<boolean> {
    try {
      await this.api.delete(`/chat/channels/${chatId}/leave`);
      return true;
    } catch {
      return false;
    }
  }

  async removeUserFromChannel(chatId: number, nickname: string): Promise<void> {
    try {
      await this.api.delete(`/chat/channels/${chatId}/users/${nickname}`);
    } catch {}
  }
}

export const chatService = new ChatService();