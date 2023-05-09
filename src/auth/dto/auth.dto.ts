import { UserEntity } from '../../user/entity/user.entity';

export class AuthDto {
  username: string;
  image: string;

  constructor(username: string, image: string) {
    this.username = username;
    this.image = image;
  }

  static fromJSON(json: any): AuthDto {
    return new AuthDto(json.login, json.image.link);
  }

  static toUserEntity(authDto: AuthDto): UserEntity {
    const user: UserEntity = new UserEntity();
    user.ftId = authDto.username;
    user.avatar = authDto.image;
    return user;
  }
}
