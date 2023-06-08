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

  async getMe(): Promise<IApiUserMe | undefined> {
    try {
      const { data } = await this.api.get<IApiUserMe>("/user/me");
      return data;
    } catch {
      return undefined;
    }
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
    try {
      await this.api.patch("/user/me/mfa/invalidate");
    } catch {}
  }

  async updateNickname(nickname: string): Promise<void> {
    return this.api.patch("/user/me/nickname", {
      nickname,
    });
  }

  async logout(): Promise<void> {
    try {
      await this.api.patch("auth/logout");
    } catch {}
  }

  async getProfile(nickname: string): Promise<IUserProfile | undefined> {
    try {
      const { data } = await this.api.get<IUserProfile>(`/user/profiles/${nickname}`);
      return data;
    } catch {
      return undefined;
    }
  }

  async addFriend(nickname: string): Promise<void> {
    try {
      const { data } = await this.api.post<void>(`/user/profiles/${nickname}/friends`);
      return data;
    } catch {}
  }

  async removeFriend(nickname: string): Promise<void> {
    try {
      const { data } = await this.api.delete<void>(`/user/profiles/${nickname}/friends`);
      return data;
    } catch {}
  }

  async blockUser(nickname: string): Promise<void> {
    try {
      const { data } = await this.api.post<void>(`/user/profiles/${nickname}/block`);
      return data;
    } catch {}
  }

  async unblockUser(nickname: string): Promise<void> {
    try {
      const { data } = await this.api.delete<void>(`/user/profiles/${nickname}/block`);
      return data;
    } catch {}
  }
}

export const userService = new UsersService();