import { Controller, Get } from '@nestjs/common';
import { GameService } from '../service/game.service';
import { MatchesHistoryDto } from '../dto/matches-history.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('matches-history')
  getMatchesHistory(): Promise<MatchesHistoryDto[]> {
    return this.gameService.getMatchesHistory();
  }
}
