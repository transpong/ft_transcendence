import { classToPlain, Expose } from '@nestjs/class-transformer';
import { MatchHistoryEntity } from '../entity/game.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { MatchStatus } from '../enum/MatchStatus';

export class MatchesUserDto {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'ft_id' })
  ftId: string;

  @Expose({ name: 'nickname' })
  nickname: string;

  @Expose({ name: 'is_winner' })
  isWinner?: boolean;

  @Expose({ name: 'score' })
  score: number;

  @Expose({ name: 'avatar' })
  avatar: string;

  @Expose({ name: 'custom' })
  custom: number;

  static toDto(
    matchHistory: MatchHistoryEntity,
    user: UserEntity,
  ): MatchesUserDto {
    const matchHistoryDto: MatchesUserDto = new MatchesUserDto();

    matchHistoryDto.id = user.id;
    matchHistoryDto.ftId = user.ftId;
    matchHistoryDto.nickname = user.nickname;
    if (matchHistory.status === MatchStatus.FINISHED) {
      matchHistoryDto.isWinner = MatchesUserDto.updateWinner(
        matchHistory,
        user,
      );
      matchHistoryDto.score = MatchesUserDto.updateScore(matchHistory, user);
    }
    matchHistoryDto.avatar = user.avatar;
    matchHistoryDto.custom = matchHistory.custom;
    return matchHistoryDto;
  }

  private static updateWinner(
    matchHistory: MatchHistoryEntity,
    user: UserEntity,
  ): boolean {
    if (matchHistory.winner != null) {
      return matchHistory.winner.id === user.id;
    } else {
      return false;
    }
  }

  private static updateScore(
    matchHistory: MatchHistoryEntity,
    user: UserEntity,
  ): number {
    if (user.ftId == matchHistory.user1.ftId) {
      return matchHistory.user1Score;
    } else if (user.ftId == matchHistory.user2.ftId) {
      return matchHistory.user2Score;
    }
  }

  toJSON() {
    return classToPlain(this);
  }
}
