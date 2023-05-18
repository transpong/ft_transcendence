import { classToPlain, Expose } from '@nestjs/class-transformer';
import { MatchHistoryEntity } from '../entity/game.entity';
import { UserEntity } from '../../user/entity/user.entity';

export class MatchesUserDto {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'ft_id' })
  ftId: string;

  @Expose({ name: 'nickname' })
  nickname: string;

  @Expose({ name: 'is_winner' })
  isWinner: boolean;

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
    matchHistoryDto.isWinner = matchHistory.winner.id === user.id;
    matchHistoryDto.score =
      matchHistory.winner.id === user.id
        ? matchHistory.user1Score
        : matchHistory.user2Score;
    matchHistoryDto.avatar = user.avatar;
    matchHistoryDto.custom = matchHistory.custom;
    return matchHistoryDto;
  }

  toJSON() {
    return classToPlain(this);
  }
}
