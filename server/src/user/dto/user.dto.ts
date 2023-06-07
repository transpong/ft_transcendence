import { UserEntity } from '../entity/user.entity';
import { classToPlain, Expose } from '@nestjs/class-transformer';

export class UserDto {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'ft_id' })
  ftId: string;

  @Expose({ name: 'nickname' })
  nickname: string;

  @Expose({ name: 'avatar' })
  avatar: string;

  @Expose({ name: 'is_mfa_enabled' })
  isMfaEnabled: boolean;

  constructor(
    id: number,
    ftId: string,
    nickname: string,
    avatar: string,
    isMfaEnabled: boolean,
  ) {
    this.id = id;
    this.ftId = ftId;
    this.nickname = nickname;
    this.avatar = avatar;
    this.isMfaEnabled = isMfaEnabled;
  }

  static fromEntity(userEntity: UserEntity): UserDto {
    return new UserDto(
      userEntity.id,
      userEntity.ftId,
      userEntity.nickname,
      userEntity.avatar,
      !!userEntity.tokenMFA,
    );
  }

  toJSON() {
    return classToPlain(this);
  }
}
