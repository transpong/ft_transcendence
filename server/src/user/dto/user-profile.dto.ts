import { UserEntity } from '../entity/user.entity';
import { classToPlain, Expose } from '@nestjs/class-transformer';

export class UserProfileDto {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'ft_id' })
  ftId: string;

  @Expose({ name: 'nickname' })
  nickname: string;

  @Expose({ name: 'avatar' })
  avatar: string;

  @Expose({ name: 'is_friend' })
  isFriend: boolean;

  @Expose({ name: 'is_blocked' })
  isBlocked: boolean;

  @Expose({ name: 'status' })
  status: number;

  static fromEntity(
    userEntity: UserEntity,
    profileEntity: UserEntity,
  ): UserProfileDto {
    const profileDto: UserProfileDto = new UserProfileDto();

    profileDto.id = profileEntity.id;
    profileDto.ftId = profileEntity.ftId;
    profileDto.nickname = profileEntity.nickname;
    profileDto.avatar = profileEntity.avatar;
    profileDto.isFriend = userEntity.isFriend(profileEntity);
    profileDto.isBlocked = userEntity.isBlocked(profileEntity);
    profileDto.status = profileEntity.status;

    return profileDto;
  }

  toJSON() {
    return classToPlain(this);
  }
}
