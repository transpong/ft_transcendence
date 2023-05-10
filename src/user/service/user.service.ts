import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { AuthDto } from '../../auth/dto/auth.dto';
import { ImageService } from './image.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly imageService: ImageService,
  ) {}

  async createUser(authDto: AuthDto): Promise<void> {
    const user: UserEntity = AuthDto.toUserEntity(authDto);
    const imageUrl: string = await this.imageService.downloadImageFromUrl(
      authDto.image,
    );

    user.avatar = imageUrl;

    // console.log(imageUrl); // TODO: remove this debug log
    // console.log(user); // TODO: remove this debug log
    this.userRepository.create(user);
    await this.userRepository.save(user);
    console.log(`User ${user.ftId} created!`); // TODO: remove this debug log
  }

  async userExists(ftId: string): Promise<boolean> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { ftId: ftId },
    });
    return !!user;
  }

  async userEmptyNickname(ftId: string): Promise<boolean> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { ftId },
    });
    if (!user) return false;
    console.log('busca ' + user); // TODO: remove this debug log
    return user.nickname === '';
  }
}
