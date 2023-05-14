import { UserEntity } from '../../../user/entity/user.entity';

export class SenderDto {
  id: number;
  ftId: string;
  nickname: string;
  avatar: string;
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
}
