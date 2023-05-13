import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { AuthDto } from '../../auth/dto/auth.dto';
import { generateSecret, verify } from '2fa-util';
import { AvatarService } from '../../avatar/service/avatar.service';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly avatarService: AvatarService,
  ) {}

  async createUser(authDto: AuthDto): Promise<void> {
    const user: UserEntity = AuthDto.toUserEntity(authDto);

    await this.userRepository.save(user);
    console.log(`User ${user.ftId} created!`); // TODO: remove this debug log
  }

  async userExists(ftId: string): Promise<boolean> {
    const user: UserEntity = await this.userRepository.findOneBy({
      ftId: ftId,
    });

    return !!user;
  }

  async userHasEmptyNickname(ftId: string): Promise<boolean> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { ftId },
    });

    if (!user) return false;
    return user.nickname === '';
  }

  async getUserByFtId(ftId: string): Promise<UserEntity> {
    const userEntity: UserEntity = await this.userRepository.findOneBy({
      ftId,
    });

    if (!userEntity) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return userEntity;
  }

  async generateMfaSecret(ftId: string) {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);
    const mfaSecret = await generateSecret(userEntity.ftId, 'Transpong');

    userEntity.tokenMFA = mfaSecret.secret;
    userEntity.validatedAtMFA = null;
    await this.userRepository.update(userEntity.id, userEntity);
    return {
      secret: mfaSecret.secret,
      qr_code_url: mfaSecret.qrcode,
    };
  }

  async validateMfaSecret(ftId: string, code: string): Promise<void> {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);

    if (!(await verify(code, userEntity.tokenMFA))) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    userEntity.validatedAtMFA = new Date();
    await this.userRepository.update(userEntity.id, userEntity);
  }

  async invalidateMfaSecret(ftId: string): Promise<void> {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);

    userEntity.tokenMFA = null;
    userEntity.validatedAtMFA = null;
    await this.userRepository.update(userEntity.id, userEntity);
  }

  async userHasMfa(ftId: string): Promise<boolean> {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);

    return userEntity.tokenMFA !== null;
  }

  async updateNickname(ftId: string, nickname: string): Promise<void> {
    if (!(await this.validNickname(nickname))) {
      throw new HttpException('Invalid nickname', HttpStatus.BAD_REQUEST);
    }
    const userEntity: UserEntity = await this.getUserByFtId(ftId);

    userEntity.nickname = nickname;
    await this.userRepository.update(userEntity.id, userEntity);
  }

  async updateAvatar(ftId: string, file: Express.Multer.File): Promise<void> {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);

    this.avatarService.deleteImage(userEntity.avatar);
    userEntity.avatar = await this.avatarService.upload(file);
    await this.userRepository.update(userEntity.id, userEntity);
  }

  async getUserInfo(ftId: string): Promise<UserDto> {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);

    return UserDto.fromEntity(userEntity);
  }

  private async validNickname(nickname: string): Promise<boolean> {
    if (nickname === '' || nickname === null) return false;
    const userEntity: UserEntity = await this.userRepository.findOneBy({
      nickname: nickname,
    });

    return !userEntity;
  }
}
