import { AxiosInstance } from "axios";
import { apiService } from "./api";

export interface IApiUserMe {
  id: number;
  ftId: string;
  nickname: string;
  avatar: string;
  isMfaEnabled: boolean;
}

export class UsersService {
  private api: AxiosInstance
  constructor () {
    this.api = apiService.getAxios();
  }

  async getMe(): Promise<IApiUserMe> {
    const { data } = await this.api.get<IApiUserMe>("/user/me");
    return data;
  }

  async uploadAvatar(avatar: FormData): Promise<void> {
    return this.api.patch("/user/me/avatar", avatar);
  }
}

export const userService = new UsersService();