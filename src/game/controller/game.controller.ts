import { Controller, Get, Param, Query } from '@nestjs/common';
import { GameService } from '../service/game.service';
import { MatchesHistoryDto } from '../dto/matches-history.dto';
import { MatchesRakingDto } from '../dto/matches-raking.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('matches-history')
  getMatchesHistory(): Promise<MatchesHistoryDto[]> {
    return this.gameService.getMatchesHistory();
  }

  @Get('matches-history')
  getMatchesHistoryFromUser(@Query() nickname): Promise<MatchesHistoryDto[]> {
    return this.gameService.getMatchesHistoryFromUser(nickname);
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
