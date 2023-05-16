import { AxiosInstance } from "axios";
import { apiService } from "./api";

export interface IApiUserMe {
  id: number;
  ft_id: string;
  nickname: string;
  avatar: string;
  is_mfa_enabled: boolean;
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
}

export const userService = new UsersService();