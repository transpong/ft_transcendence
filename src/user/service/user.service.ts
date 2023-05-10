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
    // download image from 42 api
    const imageUrl: string = await this.imageService.downloadImageFromUrl(
      authDto.image,
    );

    console.log(imageUrl); // TODO: remove this debug log

    const user: UserEntity = new UserEntity();
    user.ftId = authDto.username;
    user.avatar = imageUrl;

    user.status = 0;
    console.log(user); // TODO: remove this debug log

    await this.userRepository.save(user);
    console.log(`User ${user.ftId} created!`); // TODO: remove this debug log
  }

  async userExists(ftId: string): Promise<boolean> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { ftId },
    });
    return !!user;
  }

  async userHasNickname(ftId: string): Promise<boolean> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { ftId },
    });

    return user !== null && user.nickname !== null;
  }
}
