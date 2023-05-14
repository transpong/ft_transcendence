import { UserEntity } from '../../../user/entity/user.entity';

export class SenderDto {
  id: number;
  nickname: string;
  avatar: string;
  status: number;

  static fromUser(userEntity: UserEntity): SenderDto {
    const senderDto: SenderDto = new SenderDto();

    senderDto.id = userEntity.id;
    senderDto.nickname = userEntity.nickname;
    senderDto.avatar = userEntity.avatar;
    senderDto.status = userEntity.status;
    return senderDto;
  }
}
