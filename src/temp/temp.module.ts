import { Module } from '@nestjs/common';
import { TempController } from './controller/temp.controller';
import { TempService } from './service/temp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TempEntity } from './entity/temp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TempEntity])],
  controllers: [TempController],
  providers: [TempService],
})
export class TempModule {}
