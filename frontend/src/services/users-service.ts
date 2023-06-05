import { AxiosInstance } from "axios";
import { apiService } from "./api";

export interface IApiUserMe {
  id: number;
  ft_id: string;
  nickname: string;
  avatar: string;
  is_mfa_enabled: boolean;
}

export interface IUserProfile {
  id: number;
  ftId: string;
  nickname: string;
  avatar: string;
  is_friend: boolean;
  is_blocked: boolean;
  status: UserEnum;
}

export enum UserEnum {
  ONLINE = 0,
  OFFLINE = 1,
  ONGAME = 2,
  INLOBBY = 3,
}

export class UsersService {
  private api: AxiosInstance;
  constructor() {
    this.api = apiService.getAxios();
  }

  async getMe(): Promise<IApiUserMe> {
    const { data } = await this.api.get<IApiUserMe>("/user/me");
    return data;
  }

  async uploadAvatar(avatar: FormData): Promise<void> {
    return this.api.patch("/user/me/avatar", avatar);
  }

  async activateMfa(): Promise<{ qr_code_url: string; secrt: string }> {
    const { data } = await this.api.post("/user/me/mfa");
    return data;
  }

  async validateMfa(code: string): Promise<void> {
    return this.api.post("/user/me/mfa/validate", {
      code,
    });
  }

  async disableMfa(): Promise<void> {
    return this.api.patch("/user/me/mfa/invalidate");
  }

  async updateNickname(nickname: string): Promise<void> {
    return this.api.patch("/user/me/nickname", {
      nickname,
    });
  }

  async logout(): Promise<void> {
    return this.api.patch("auth/logout");
  }

  async getProfile(nickname: string): Promise<IUserProfile> {
    const { data } = await this.api.get<IUserProfile>(`/user/profiles/${nickname}`);
    return data;
  }

  async addFriend(nickname: string): Promise<void> {
    const { data } = await this.api.post<void>(`/user/profiles/${nickname}/friends`);
    return data;
  }

  async removeFriend(nickname: string): Promise<void> {
    const { data } = await this.api.delete<void>(`/user/profiles/${nickname}/friends`);
    return data;
  }

  async blockUser(nickname: string): Promise<void> {
    const { data } = await this.api.post<void>(`/user/profiles/${nickname}/block`);
    return data;
  }

  async unblockUser(nickname: string): Promise<void> {
    const { data } = await this.api.delete<void>(`/user/profiles/${nickname}/block`);
    return data;
  }
}

export const userService = new UsersService();