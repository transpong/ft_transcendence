import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { In, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { AuthDto } from '../../auth/dto/auth.dto';
import { generateSecret, verify } from '2fa-util';
import { AvatarService } from '../../avatar/service/avatar.service';
import { UserDto } from '../dto/user.dto';
import { UserEnum } from '../enum/user.enum';
import { UserProfileDto } from '../dto/user-profile.dto';

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
    const userEntity: UserEntity = await this.userRepository.findOne({
      where: { ftId: ftId },
      relations: ['directMessagesFrom', 'friends', 'blocks', 'blockedBy'],
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
    await this.userRepository.save(userEntity);
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
    await this.userRepository.save(userEntity);
  }

  async invalidateMfaSecret(ftId: string): Promise<void> {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);

    userEntity.tokenMFA = null;
    userEntity.validatedAtMFA = null;
    await this.userRepository.save(userEntity);
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
    await this.userRepository.save(userEntity);
  }

  async updateAvatar(ftId: string, file: Express.Multer.File): Promise<void> {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);

    this.avatarService.deleteImage(userEntity.avatar);
    userEntity.avatar = await this.avatarService.upload(file);
    await this.userRepository.save(userEntity);
  }

  async getUserInfo(ftId: string): Promise<UserDto> {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);

    return UserDto.fromEntity(userEntity);
  }

  async logout(ftId: string): Promise<void> {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);

    userEntity.validatedAtMFA = null;
    await this.userRepository.save(userEntity);
  }

  async getUserByNickname(nickname: string): Promise<UserEntity> {
    const userEntity: UserEntity = await this.userRepository.findOne({
      where: { nickname: nickname },
      relations: ['directMessagesFrom', 'friends', 'blocks', 'blockedBy'],
    });

    if (!userEntity) {
      throw new HttpException(
        "User with nickname '" + nickname + "' not found",
        HttpStatus.NOT_FOUND,
      );
    }
    return userEntity;
  }

  async getNotFriendsByFtId(userEntity: UserEntity): Promise<UserEntity[]> {
    const friendsIds: number[] = userEntity.friends.map((f) => f.id);

    return await this.userRepository.find({
      where: {
        id: Not(In(friendsIds)),
        ftId: Not(userEntity.ftId),
      },
      relations: ['friends', 'blocks'],
    });
  }

  async getAllUsersThatHaveMatches(): Promise<UserEntity[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.matchHistory1', 'match1')
      .leftJoinAndSelect('user.matchHistory2', 'match2')
      .where('(match1.id IS NOT NULL OR match2.id IS NOT NULL)')
      .getMany();
  }

  async newGuestUser(): Promise<UserEntity> {
    const guestUser: UserEntity = new UserEntity();

    guestUser.ftId = new Date().getTime().toString();
    guestUser.avatar = 'guest.png';

    await this.userRepository.save(guestUser);
    return guestUser;
  }

  async updateStatus(ftId: string, status: UserEnum): Promise<void> {
    const userEntity: UserEntity = await this.userRepository.findOne({
      where: { ftId: ftId },
    });

    userEntity.status = status;
    await this.userRepository.update(userEntity.id, userEntity);
  }

  async addFriend(ftId: string, nickname: string): Promise<void> {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);
    const friendEntity: UserEntity = await this.getUserByNickname(nickname);
    if (ftId === friendEntity.ftId) {
      throw new HttpException(
        'You cannot add yourself as a friend',
        HttpStatus.BAD_REQUEST,
      );
    }

    userEntity.addFriend(friendEntity);
    await this.userRepository.save(userEntity);
  }

  async removeFriend(ftId: string, nickname: string): Promise<void> {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);
    const friendEntity: UserEntity = await this.getUserByNickname(nickname);
    if (ftId === friendEntity.ftId) {
      throw new HttpException(
        'You cannot remove yourself as a friend',
        HttpStatus.BAD_REQUEST,
      );
    }

    userEntity.removeFriend(friendEntity);
    await this.userRepository.save(userEntity);
  }

  async blockUser(ftId: string, nickname: string): Promise<void> {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);
    const blockEntity: UserEntity = await this.getUserByNickname(nickname);
    if (ftId === blockEntity.ftId) {
      throw new HttpException(
        'You cannot block yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    userEntity.addBlock(blockEntity);
    await this.userRepository.save(userEntity);
  }

  async unblockUser(ftId: string, nickname: string): Promise<void> {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);
    const blockEntity: UserEntity = await this.getUserByNickname(nickname);
    if (ftId === blockEntity.ftId) {
      throw new HttpException(
        'You cannot unblock yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    userEntity.removeBlock(blockEntity);
    await this.userRepository.save(userEntity);
  }

  async getProfile(ftId: string, nickname: string): Promise<UserProfileDto> {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);
    const profileEntity: UserEntity = await this.getUserByNickname(nickname);
    if (ftId === profileEntity.ftId) {
      throw new HttpException(
        'This method is not allowed for your own profile',
        HttpStatus.BAD_REQUEST,
      );
    }

    return UserProfileDto.fromEntity(profileEntity, userEntity);
  }

  private async validNickname(nickname: string): Promise<boolean> {
    if (nickname === '' || nickname === null) return false;
    const userEntity: UserEntity = await this.userRepository.findOneBy({
      nickname: nickname,
    });

    return !userEntity;
  }
}
