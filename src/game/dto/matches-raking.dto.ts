import { UserEntity } from '../../user/entity/user.entity';
import { classToPlain, Expose } from '@nestjs/class-transformer';

export class MatchesRakingDto {
  @Expose({ name: 'position' })
  position: number;

  @Expose({ name: 'ft_id' })
  ftId: string;

  @Expose({ name: 'nickname' })
  nickname: string;

  @Expose({ name: 'avatar' })
  avatar: string;

  @Expose({ name: 'wins' })
  wins: number;

  @Expose({ name: 'loses' })
  loses: number;

  @Expose({ name: 'draws' })
  draws: number;

  @Expose({ name: 'matches' })
  matches: number;

  @Expose({ name: 'score_sum' })
  score: number;

  static toDto(
    userEntity: UserEntity,
    wins: number,
    loses: number,
    score: number,
    draw: number,
    position?: number,
  ): MatchesRakingDto {
    const matchHistoryDto: MatchesRakingDto = new MatchesRakingDto();

    matchHistoryDto.ftId = userEntity.ftId;
    matchHistoryDto.nickname = userEntity.nickname;
    matchHistoryDto.avatar = userEntity.avatar;
    matchHistoryDto.wins = wins;
    matchHistoryDto.loses = loses;
    matchHistoryDto.matches = wins + loses + draw;
    matchHistoryDto.score = score;
    matchHistoryDto.position = position;
    matchHistoryDto.draws = draw;
    return matchHistoryDto;
  }

  toJSON() {
    return classToPlain(this);
  }
}
