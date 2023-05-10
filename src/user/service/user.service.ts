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
    console.log('authDto ' + authDto.username); // TODO: remove this debug log
    const user: UserEntity = AuthDto.toUserEntity(authDto);
    console.log('createUser ' + user.ftId); // TODO: remove this debug log
    const imageUrl: string = await this.imageService.downloadImageFromUrl(
      authDto.image,
    );

    user.avatar = imageUrl;

    // console.log(imageUrl); // TODO: remove this debug log
    // console.log(user); // TODO: remove this debug log
    await this.userRepository.save(user);
    console.log(`User ${user.ftId} created!`); // TODO: remove this debug log
  }

  async userExists(ftId: string): Promise<boolean> {
    // get all
    const users = await this.userRepository.find();
    console.log('users ' + users); // TODO: remove this debug log
    console.log('ftId ' + ftId); // TODO: remove this debug log
    const user = await this.userRepository.findOneBy({ ftId: ftId });
    console.log('userExists ' + user); // TODO: remove this debug log
    return !!user;
  }

  async userEmptyNickname(ftId: string): Promise<boolean> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { ftId },
    });
    if (!user) return false;
    return user.nickname === '';
  }
}
