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
      relations: [
        'directMessagesFrom',
        'friends',
        'friends.blocks',
        'friends.blockedBy',
        'blocks',
        'blockedBy',
      ],
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
    userEntity.validatedAtMFA = new Date();
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

    return !!userEntity.tokenMFA;
  }

  async updateNickname(ftId: string, nickname: string): Promise<void> {
    if (nickname === '' || nickname === null) {
      throw new HttpException(
        'Nickname must not be empty',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (this.nicknameWithSpecialCharacters(nickname)) {
      throw new HttpException(
        'Nickname must not contain special characters',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (nickname.length > 10) {
      throw new HttpException(
        'Nickname must be less than 10 characters',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!(await this.validNickname(nickname))) {
      throw new HttpException(
        'This nickname is already taken',
        HttpStatus.BAD_REQUEST,
      );
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
    guestUser.status = UserEnum.OFFLINE;

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

  async addFriend(ftId: string, friendNickname: string): Promise<void> {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);
    const friendEntity: UserEntity = await this.getUserByNickname(
      friendNickname,
    );

    if (ftId === friendEntity.ftId) {
      throw new HttpException(
        'You cannot add yourself as a friend',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (userEntity.friends.find((friend) => friend.id === friendEntity.id)) {
      throw new HttpException(
        'User is already your friend',
        HttpStatus.BAD_REQUEST,
      );
    }

    userEntity.friends.push(friendEntity);
    await this.userRepository.save(userEntity);

    friendEntity.friends.push(userEntity);
    await this.userRepository.save(friendEntity);
  }

  async removeFriend(ftId: string, friendNickname: string): Promise<void> {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);
    const friendEntity: UserEntity = await this.getUserByNickname(
      friendNickname,
    );

    if (ftId === friendEntity.ftId) {
      throw new HttpException(
        'You cannot remove yourself as a friend',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!userEntity.friends.find((friend) => friend.id === friendEntity.id)) {
      throw new HttpException(
        'User is not your friend',
        HttpStatus.BAD_REQUEST,
      );
    }

    userEntity.friends = userEntity.friends.filter(
      (friend) => friend.id !== friendEntity.id,
    );
    await this.userRepository.save(userEntity);
    friendEntity.friends = friendEntity.friends.filter(
      (friend) => friend.id !== userEntity.id,
    );
    await this.userRepository.save(friendEntity);
  }

  async blockUser(ftId: string, userBlockNickName: string): Promise<void> {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);
    const userBlockEntity: UserEntity = await this.getUserByNickname(
      userBlockNickName,
    );

    if (userEntity.id === userBlockEntity.id) {
      throw new HttpException(
        'You cannot block yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      userEntity.blocks.find((blocked) => blocked.id === userBlockEntity.id)
    ) {
      throw new HttpException(
        'User is already blocked',
        HttpStatus.BAD_REQUEST,
      );
    }

    userEntity.blocks.push(userBlockEntity);
    await this.userRepository.save(userEntity);
    userBlockEntity.blockedBy.push(userEntity);
    await this.userRepository.save(userBlockEntity);
  }

  async unblockUser(ftId: string, userBlockNickName: string): Promise<void> {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);
    const userBlockEntity: UserEntity = await this.getUserByNickname(
      userBlockNickName,
    );

    if (ftId === userBlockEntity.ftId) {
      throw new HttpException(
        'You cannot unblock yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      !userEntity.blocks.find((blocked) => blocked.id === userBlockEntity.id)
    ) {
      throw new HttpException('User is not blocked', HttpStatus.BAD_REQUEST);
    }

    userEntity.blocks = userEntity.blocks.filter(
      (blocked) => blocked.id !== userBlockEntity.id,
    );
    await this.userRepository.save(userEntity);

    userBlockEntity.blockedBy = userBlockEntity.blockedBy.filter(
      (blocked) => blocked.id !== userEntity.id,
    );
    await this.userRepository.save(userBlockEntity);
  }

  async getProfile(ftId: string, nickname: string): Promise<UserProfileDto> {
    const userEntity: UserEntity = await this.getUserByFtId(ftId);
    const profileEntity: UserEntity = await this.getUserByNickname(nickname);

    return UserProfileDto.fromEntity(userEntity, profileEntity);
  }

  private async validNickname(nickname: string): Promise<boolean> {
    const userEntity: UserEntity = await this.userRepository.findOneBy({
      nickname: nickname,
    });

    return !userEntity;
  }

  private nicknameWithSpecialCharacters(nickname: string): boolean {
    return !nickname.match(/^[A-Za-z0-9_-]+$/);
  }
}
