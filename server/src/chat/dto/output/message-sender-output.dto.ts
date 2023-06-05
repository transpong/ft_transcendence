import { UserEntity } from '../../../user/entity/user.entity';
import { classToPlain, Expose } from '@nestjs/class-transformer';

export class SenderDto {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'ft_id' })
  ftId: string;

  @Expose({ name: 'nickname' })
  nickname: string;

  @Expose({ name: 'avatar' })
  avatar: string;

  @Expose({ name: 'status' })
  status: number;

  static fromUser(userEntity: UserEntity): SenderDto {
    const senderDto: SenderDto = new SenderDto();

    senderDto.id = userEntity.id;
    senderDto.ftId = userEntity.ftId;
    senderDto.nickname = userEntity.nickname;
    senderDto.avatar = userEntity.avatar;
    senderDto.status = userEntity.status;
    return senderDto;
  }

  toJSON() {
    return classToPlain(this);
  }
}
