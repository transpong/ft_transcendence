import { AxiosInstance } from "axios";
import { apiService } from "./api";
import { IApiUserMe } from "./users-service";

export interface IChatList {
  channels: IChannelChat[];
  otherChannels: IChannelChat[];
  friends: IApiUserMe[]; // TODO change it when backend fix
  otherUsers: IApiUserMe[];
}

export interface IChannelChat {
  id: number;
  name: string;
  type: number;
  userAccessType: UserAccessType;
  bannedAt: Date;
  kickedAt: Date;
  mutedUntil: Date;
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

export interface IApiDirectMessagesList {
  user: IApiSender;
  messages: IMessage[];
}

interface IApiSender {
  id: number;
  ftId: string;
  nickname: string;
  avatar: string;
  status: number;
}

interface IMessage {
  id: number;
  created_at: Date;
  message_text: string;
  sender: IApiSender;
  am_i_sender: boolean;
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
    await this.api.post(`/chat/channel/direct/${nickname}/messages`, { message });
  }
}

export const chatService = new ChatService();