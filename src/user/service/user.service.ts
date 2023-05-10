import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { AuthDto } from '../../auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(authDto: AuthDto): Promise<void> {
    const user: UserEntity = AuthDto.toUserEntity(authDto);
    user.created_at = new Date();

    await this.userRepository.save(user);
    console.log(`User ${user.ft_id} created!`); // TODO: remove this debug log
  }

  async userExists(ft_id: string): Promise<boolean> {
    const user: UserEntity = await this.userRepository.findOneBy({
      ft_id: ft_id,
    });

    return !!user;
  }

  async userEmptyNickname(ft_id: string): Promise<boolean> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { ft_id },
    });
    if (!user) return false;
    return user.nickname === '';
  }

  async getUserByFtId(ft_id: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ ft_id });
  }
}
