import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchHistoryEntity } from '../entity/game.entity';
import { DeleteResult, Not, Repository } from 'typeorm';
import { UserService } from '../../user/service/user.service';
import { MatchesHistoryDto } from '../dto/matches-history.dto';
import { MatchesRakingDto } from '../dto/matches-raking.dto';
import { UserEntity } from '../../user/entity/user.entity';
import { MatchStatus } from '../enum/MatchStatus';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(MatchHistoryEntity)
    private readonly matchHistoryRepository: Repository<MatchHistoryEntity>,
    private readonly userService: UserService,
  ) {}

  async getMatchesHistory(status?: number): Promise<MatchesHistoryDto[]> {
    const matchesHistoryList: MatchHistoryEntity[] =
      await this.findAllMatchesHistory(status);

    return MatchesHistoryDto.toDtoList(matchesHistoryList);
  }

  async getMatchesHistoryFromUser(
    nickname: string,
    status?: number,
  ): Promise<MatchesHistoryDto[]> {
    const matchesHistoryList: MatchHistoryEntity[] =
      await this.findMatchesHistoryFromUser(nickname, status);

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
    const draws: number = this.getDraws(matchesHistoryList, nickname);
    const position: number = await this.getPositionFromUser(user);

    return MatchesRakingDto.toDto(user, wins, losses, score, draws, position);
  }

  async createMatchHistory(user1: string, user2: string, roomName: string) {
    const matchHistory = new MatchHistoryEntity();
    const user1Entity: UserEntity = await this.userService.getUserByFtId(user1);
    const user2Entity: UserEntity = await this.userService.getUserByFtId(user2);

    matchHistory.user1 = user1Entity;
    matchHistory.user2 = user2Entity;
    matchHistory.user1IsReady = false;
    matchHistory.user2IsReady = false;
    matchHistory.roomId = roomName;
    matchHistory.status = MatchStatus.IS_WAITING;
    await this.matchHistoryRepository.save(matchHistory);
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
      const draws: number = this.getDraws(matchesHistoryList, user.nickname);
      const matchesRakingDto: MatchesRakingDto = MatchesRakingDto.toDto(
        user,
        wins,
        losses,
        score,
        draws,
      );

      matchesRakingDtoList.push(matchesRakingDto);
    }
    return matchesRakingDtoList;
  }

  private sortRankingList(matchesRakingDtoList: MatchesRakingDto[]) {
    matchesRakingDtoList
      .sort((a, b) => {
        if (a.wins - a.loses > b.wins - b.loses) {
          return -1;
        }
        if (a.wins - a.loses < b.wins - b.loses) {
          return 1;
        }
        if (a.score > b.score) {
          return -1;
        }
        if (a.score < b.score) {
          return 1;
        }
        return -1;
      })
      .forEach((matchRakingDto, index) => {
        matchRakingDto.position = index + 1;
      });
  }

  private getWins(matchesHistoryList: MatchHistoryEntity[], nickname: string) {
    let wins = 0;

    matchesHistoryList.forEach((matchHistory) => {
      if (matchHistory.winner && matchHistory.winner.nickname === nickname) {
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
      if (
        matchHistory.user1?.nickname !== nickname &&
        matchHistory.user2?.nickname !== nickname
      )
        return;
      if (matchHistory.winner && matchHistory.winner.nickname !== nickname) {
        losses++;
      }
    });
    return losses;
  }

  getDraws(matchesHistoryList: MatchHistoryEntity[], nickname: string) {
    let draws = 0;

    // get draws when matchesHistoryList.winner == null and matchesHistoryList.user1.nickname == nickname || matchesHistoryList.user2.nickname == nickname
    matchesHistoryList.forEach((matchHistory) => {
      if (
        matchHistory.user1?.nickname !== nickname &&
        matchHistory.user2?.nickname !== nickname
      )
        return;
      if (matchHistory.status !== MatchStatus.FINISHED) return;
      if (!matchHistory.winner) {
        draws++;
      }
    });
    return draws;
  }

  getByRoomName(roomName: string) {
    return this.matchHistoryRepository.findOne({
      where: { roomId: roomName },
      relations: ['user1', 'user2', 'winner'],
    });
  }

  async getRoomId(ftId: string) {
    const matchHistory = await this.matchHistoryRepository.findOne({
      where: [
        { user1: { ftId: ftId }, status: Not(MatchStatus.FINISHED) },
        { user2: { ftId: ftId }, status: Not(MatchStatus.FINISHED) },
      ],

      relations: ['user1', 'user2', 'winner'],
    });

    if (matchHistory) {
      return matchHistory.roomId;
    }

    return null;
  }

  async updateMatch(matchHistory: MatchHistoryEntity) {
    return this.matchHistoryRepository.save(matchHistory);
  }

  async isMatchHistoryExist(ftId: string) {
    const matchHistory: MatchHistoryEntity =
      await this.matchHistoryRepository.findOne({
        where: [
          { user1: { ftId: ftId }, status: Not(MatchStatus.FINISHED) },
          { user2: { ftId: ftId }, status: Not(MatchStatus.FINISHED) },
        ],
        relations: ['user1', 'user2', 'winner'],
      });

    return !!matchHistory;
  }

  async existingMatchHistory(ftId: string) {
    const matchHistory: MatchHistoryEntity | null =
      await this.matchHistoryRepository.findOne({
        where: [
          { user1: { ftId: ftId }, status: Not(MatchStatus.FINISHED) },
          { user2: { ftId: ftId }, status: Not(MatchStatus.FINISHED) },
        ],
        relations: ['user1', 'user2', 'winner'],
      });

    return matchHistory;
  }

  async isMatchHistoryExistByNickname(nickname: string) {
    const matchHistory: MatchHistoryEntity =
      await this.matchHistoryRepository.findOne({
        where: [
          { user1: { nickname: nickname }, status: Not(MatchStatus.FINISHED) },
          { user2: { nickname: nickname }, status: Not(MatchStatus.FINISHED) },
        ],
        relations: ['user1', 'user2', 'winner'],
      });

    return !!matchHistory;
  }

  async deleteMatchHistory(roomId: string) {
    const matchHistory = await this.matchHistoryRepository.findOne({
      where: { roomId: roomId },
    });

    if (matchHistory) {
      await this.matchHistoryRepository.delete(matchHistory.id);
    }
  }

  cleanupUnfinishedMatches(): Promise<DeleteResult> {
    return this.matchHistoryRepository.delete({
      status: Not(MatchStatus.FINISHED),
    });
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

  private async findAllMatchesHistory(status?: number) {
    return this.matchHistoryRepository.find({
      relations: ['user1', 'user2', 'winner'],
      order: { createdAt: 'DESC' },
      where: {
        status,
      },
    });
  }

  private async findMatchesHistoryFromUser(nickname: string, status?: number) {
    return this.matchHistoryRepository.find({
      relations: ['user1', 'user2', 'winner'],
      where: [
        { user1: { nickname: nickname } },
        { user2: { nickname: nickname } },
        { status },
      ],
      order: { createdAt: 'DESC' },
    });
  }
}
