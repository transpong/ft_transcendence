import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TempService } from '../service/temp.service';
import { TempEntity } from '../entity/temp.entity';

@Controller('temp')
export class TempController {
  constructor(private readonly tempService: TempService) {}

  @Get()
  async findAll(): Promise<TempEntity[]> {
    return await this.tempService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<TempEntity> {
    return await this.tempService.findOne(id);
  }

  @Post()
  async create(@Body() temp: TempEntity): Promise<TempEntity> {
    return await this.tempService.create(temp);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() temp: TempEntity,
  ): Promise<TempEntity> {
    return await this.tempService.update(id, temp);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.tempService.delete(id);
  }
}
