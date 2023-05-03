// temp.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TempEntity } from '../entity/temp.entity';

@Injectable()
export class TempService {
  constructor(
    @InjectRepository(TempEntity)
    private readonly tempRepository: Repository<TempEntity>,
  ) {}

  async findAll(): Promise<TempEntity[]> {
    return await this.tempRepository.find();
  }

  async findOne(id: number): Promise<TempEntity> {
    return await this.tempRepository
      .createQueryBuilder('temp')
      .where('temp.id = :id', { id })
      .getOne();
  }

  async create(temp: TempEntity): Promise<TempEntity> {
    return await this.tempRepository.save(temp);
  }

  async update(id: number, temp: TempEntity): Promise<TempEntity> {
    await this.tempRepository.update(id, temp);
    return await this.tempRepository
      .createQueryBuilder('temp')
      .where('temp.id = :id', { id })
      .getOne();
  }

  async delete(id: number): Promise<void> {
    await this.tempRepository.delete(id);
  }
}
