import { Expose } from '@nestjs/class-transformer';
import { MatchHistoryEntity } from '../entity/game.entity';
import { MatchesUserDto } from './matchers-user.dto';

export class MatchesHistoryDto {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'user_1' })
  user1: MatchesUserDto;

  @Expose({ name: 'user_2' })
  user2: MatchesUserDto;

  static toDto(matchHistoryEntity: MatchHistoryEntity): MatchesHistoryDto {
    const matchHistoryDto: MatchesHistoryDto = new MatchesHistoryDto();

    matchHistoryDto.id = matchHistoryEntity.id;
    matchHistoryDto.createdAt = matchHistoryEntity.createdAt;
    matchHistoryDto.user1 = MatchesUserDto.toDto(
      matchHistoryEntity,
      matchHistoryEntity.user1,
    );
    matchHistoryDto.user2 = MatchesUserDto.toDto(
      matchHistoryEntity,
      matchHistoryEntity.user2,
    );
    return matchHistoryDto;
  }

  static toDtoList(
    matchHistoryEntities: MatchHistoryEntity[],
  ): MatchesHistoryDto[] {
    const matchHistoryDtoList: MatchesHistoryDto[] = [];

    matchHistoryEntities.forEach((matchHistoryEntity) => {
      matchHistoryDtoList.push(MatchesHistoryDto.toDto(matchHistoryEntity));
    });
    return matchHistoryDtoList;
  }
}
