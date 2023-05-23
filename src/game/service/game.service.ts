import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchHistoryEntity } from '../entity/game.entity';
import { Repository } from 'typeorm';
import { UserService } from '../../user/service/user.service';
import { MatchesHistoryDto } from '../dto/matches-history.dto';
import { MatchesRakingDto } from '../dto/matches-raking.dto';
import { UserEntity } from '../../user/entity/user.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(MatchHistoryEntity)
    private readonly matchHistoryRepository: Repository<MatchHistoryEntity>,
    private readonly userService: UserService,
  ) {}

  async getMatchesHistory(): Promise<MatchesHistoryDto[]> {
    const matchesHistoryList: MatchHistoryEntity[] =
      await this.findAllMatchesHistory();

    return MatchesHistoryDto.toDtoList(matchesHistoryList);
  }

  async getMatchesHistoryFromUser(
    nickname: string,
  ): Promise<MatchesHistoryDto[]> {
    const matchesHistoryList: MatchHistoryEntity[] =
      await this.findMatchesHistoryFromUser(nickname);

    return MatchesHistoryDto.toDtoList(matchesHistoryList);
  }

  async getRanking(): Promise<MatchesRakingDto[]> {
    const users: UserEntity[] =
      await this.userService.getAllUsersThatHaveMatches();
    const matchesHistoryList: MatchHistoryEntity[] =
      await this.findAllMatchesHistory();
    const matchesRakingDtoList: MatchesRakingDto[] = this.getRankingList(
      users,
      matchesHistoryList,
    );

    this.sortRankingList(matchesRakingDtoList);

    return matchesRakingDtoList;
  }

  async getRankingFromUser(nickname: string): Promise<MatchesRakingDto> {
    const user: UserEntity = await this.userService.getUserByNickname(nickname);
    const matchesHistoryList: MatchHistoryEntity[] =
      await this.findMatchesHistoryFromUser(nickname);
    const wins: number = this.getWins(matchesHistoryList, nickname);
    const losses: number = this.getLosses(matchesHistoryList, nickname);
    const score: number = this.getScore(matchesHistoryList, nickname);
    const position: number = await this.getPositionFromUser(user);

    return MatchesRakingDto.toDto(user, wins, losses, score, position);
  }

  private async getPositionFromUser(user: UserEntity): Promise<number> {
    const users: UserEntity[] =
      await this.userService.getAllUsersThatHaveMatches();
    const matchesHistoryList: MatchHistoryEntity[] =
      await this.findAllMatchesHistory();
    const matchesRakingDtoList: MatchesRakingDto[] = this.getRankingList(
      users,
      matchesHistoryList,
    );

    this.sortRankingList(matchesRakingDtoList);

    const position: number = matchesRakingDtoList.findIndex(
      (matchRakingDto) => matchRakingDto.nickname === user.nickname,
    );

    return position + 1;
  }

  private getRankingList(
    users: UserEntity[],
    matchesHistoryList: MatchHistoryEntity[],
  ): MatchesRakingDto[] {
    const matchesRakingDtoList: MatchesRakingDto[] = [];

    for (let i = 0; i < users.length; i++) {
      const user: UserEntity = users[i];
      const wins: number = this.getWins(matchesHistoryList, user.nickname);
      const losses: number = this.getLosses(matchesHistoryList, user.nickname);
      const score: number = this.getScore(matchesHistoryList, user.nickname);
      const matchesRakingDto: MatchesRakingDto = MatchesRakingDto.toDto(
        user,
        wins,
        losses,
        score,
      );

      matchesRakingDtoList.push(matchesRakingDto);
    }
    return matchesRakingDtoList;
  }

  private sortRankingList(matchesRakingDtoList: MatchesRakingDto[]) {
    matchesRakingDtoList
      .sort((a, b) => {
        if (a.wins > b.wins) {
          return -1;
        }
        if (a.wins < b.wins) {
          return 1;
        }
        if (a.wins === b.wins) {
          if (a.score > b.score) {
            return -1;
          }
          if (a.score < b.score) {
            return 1;
          }
        }
        if (a.wins === b.wins && a.score === b.score) {
          if (a.loses < b.loses) {
            return -1;
          }
          if (a.loses > b.loses) {
            return 1;
          }
        }
        return 0;
      })
      .forEach((matchRakingDto, index) => {
        matchRakingDto.position = index + 1;
      });
  }

  private getWins(matchesHistoryList: MatchHistoryEntity[], nickname: string) {
    let wins = 0;

    matchesHistoryList.forEach((matchHistory) => {
      if (matchHistory.winner.nickname === nickname) {
        wins++;
      }
    });
    return wins;
  }

  private getLosses(
    matchesHistoryList: MatchHistoryEntity[],
    nickname: string,
  ) {
    let losses = 0;

    matchesHistoryList.forEach((matchHistory) => {
      if (matchHistory.winner.nickname !== nickname) {
        losses++;
      }
    });
    return losses;
  }

  private getScore(matchesHistoryList: MatchHistoryEntity[], nickname: string) {
    let score = 0;

    matchesHistoryList.forEach((matchHistory) => {
      if (matchHistory.user1.nickname === nickname) {
        score += matchHistory.user1Score;
      }
      if (matchHistory.user2.nickname === nickname) {
        score += matchHistory.user2Score;
      }
    });
    return score;
  }

  private async findAllMatchesHistory() {
    return this.matchHistoryRepository.find({
      relations: ['user1', 'user2', 'winner'],
      order: { createdAt: 'DESC' },
    });
  }

  private async findMatchesHistoryFromUser(nickname: string) {
    return this.matchHistoryRepository.find({
      relations: ['user1', 'user2', 'winner'],
      where: [
        { user1: { nickname: nickname } },
        { user2: { nickname: nickname } },
      ],
      order: { createdAt: 'DESC' },
    });
  }
}
