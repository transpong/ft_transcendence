import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { GameService } from '../service/game.service';
import { MatchesHistoryDto } from '../dto/matches-history.dto';
import { MatchesRakingDto } from '../dto/matches-raking.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('matches-history')
  getMatchesHistoryFromUser(
    @Query('nickname') nickname?: string,
    @Query('status') status?: number,
  ): Promise<MatchesHistoryDto[]> {
    if (nickname)
      return this.gameService.getMatchesHistoryFromUser(nickname, status);

    return this.gameService.getMatchesHistory(status);
  }

  @Get('ranking')
  getRanking(): Promise<MatchesRakingDto[]> {
    return this.gameService.getRanking();
  }

  @Get('ranking/:nickname')
  getRankingFromUser(@Param('nickname') nickname): Promise<MatchesRakingDto> {
    return this.gameService.getRankingFromUser(nickname);
  }
}
