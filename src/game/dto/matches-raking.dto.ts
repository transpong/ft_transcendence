import { UserEntity } from '../../user/entity/user.entity';

export class MatchesRakingDto {
  ftId: string;
  nickname: string;
  avatar: string;
  wins: number;
  loses: number;
  matches: number;

  static toDto(
    userEntity: UserEntity,
    wins: number,
    loses: number,
  ): MatchesRakingDto {
    const matchHistoryDto: MatchesRakingDto = new MatchesRakingDto();

    matchHistoryDto.ftId = userEntity.ftId;
    matchHistoryDto.nickname = userEntity.nickname;
    matchHistoryDto.avatar = userEntity.avatar;
    matchHistoryDto.wins = wins;
    matchHistoryDto.loses = loses;
    matchHistoryDto.matches = wins + loses;
    return matchHistoryDto;
  }
}
