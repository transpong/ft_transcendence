import { AxiosInstance } from "axios";
import { apiService } from "./api";

export interface IApiRanking {
  position: number;
  ftId: string;
  nickname: string;
  avatar: string;
  wins: number;
  loses: number;
  matches: number;
  score: number;
}

export interface IApiMatchHistory {
  id: number;
  created_at: Date;
  user_1: IApiMatchUser;
  user_2: IApiMatchUser;
}

interface IApiMatchUser {
  id: number;
  ft_id: string;
  nickname: string;
  is_winner: boolean;
  score: number;
  avatar: string;
  custom: number;
}

export class GameService {
  private api: AxiosInstance;
  constructor() {
    this.api = apiService.getAxios();
  }

  async getRanking(): Promise<IApiRanking[]> {
    const { data } = await this.api.get<IApiRanking[]>("/game/ranking");
    return data;
  }

  async getUserRanking(nickname: string): Promise<IApiRanking> {
    const { data } = await this.api.get<IApiRanking>(`/game/ranking/${nickname}`);
    return data;
  }

  async getMatchesHistory(nickname?: string): Promise<IApiMatchHistory[]> {
    const { data } = await this.api.get<IApiMatchHistory[]>(
      "/game/matches-history",
      {
        params: {
          nickname,
        },
      }
    );
    return data;
  }
}

export const gameService = new GameService();