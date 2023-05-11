import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { AuthDto } from '../../auth/dto/auth.dto';
import { generateSecret, verify } from '2fa-util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(authDto: AuthDto): Promise<void> {
    const user: UserEntity = AuthDto.toUserEntity(authDto);
    user.createdAt = new Date();
    user.updatedAt = new Date();

    await this.userRepository.save(user);
    console.log(`User ${user.ftId} created!`); // TODO: remove this debug log
  }

  async userExists(ftId: string): Promise<boolean> {
    const user: UserEntity = await this.userRepository.findOneBy({
      ftId: ftId,
    });

    return !!user;
  }

  async userEmptyNickname(ftId: string): Promise<boolean> {
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
    await this.userRepository.update(userEntity.id, userEntity);
    return {
      secret: mfaSecret.secret,
      qr_code_url: mfaSecret.qrcode,
    };
  }

  async validateMfaSecret(ftId: string, token: string): Promise<void> {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);

    if (await verify(userEntity.tokenMFA, token)) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    userEntity.validatedAtMFA = new Date();
    await this.userRepository.update(userEntity.id, userEntity);
  }
}
