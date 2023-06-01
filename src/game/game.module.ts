import { Module } from '@nestjs/common';
import { GameController } from './controller/game.controller';
import { GameService } from './service/game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchHistoryEntity } from './entity/game.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([MatchHistoryEntity]), UserModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
