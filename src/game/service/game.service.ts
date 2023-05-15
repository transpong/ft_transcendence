import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchHistoryEntity } from '../entity/game.entity';
import { Repository } from 'typeorm';
import { UserService } from '../../user/service/user.service';
import { MatchesHistoryDto } from '../dto/matches-history.dto';

@Injectable()
export class GameService {
  @InjectRepository(MatchHistoryEntity)
  private readonly matchHistoryRepository: Repository<MatchHistoryEntity>;
  private readonly userService: UserService;

  async getMatchesHistory(): Promise<MatchesHistoryDto[]> {
    const matchesHistory: MatchHistoryEntity[] =
      await this.getAllMatchesHistory();

    return MatchesHistoryDto.toDtoList(matchesHistory);
  }

  private async getAllMatchesHistory() {
    return this.matchHistoryRepository.find({
      relations: ['user1', 'user2', 'winner'],
      order: { createdAt: 'DESC' },
    });
  }
}
