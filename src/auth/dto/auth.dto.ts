import { UserEntity } from '../../user/entity/user.entity';

export class AuthDto {
  username: string;
  image: string;

  constructor(username: string, image: string) {
    this.username = username;
    this.image = image;
  }

  static fromJSON(json: any): AuthDto {
    if (json.login === undefined) return new AuthDto(json.username, json.image);
    return new AuthDto(json.login, json.image.link);
  }

  static toUserEntity(authDto: AuthDto): UserEntity {
    const user: UserEntity = new UserEntity();
    user.ftId = authDto.username;
    user.avatar = authDto.image;
    user.status = 0;
    user.nickname = '';
    return user;
  }
}
