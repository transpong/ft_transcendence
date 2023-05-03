import { TempEntity } from '../entity/temp.entity';

export class TempDto {
  constructor(name: string, cpf: string, email: string) {
    this.name = name;
    this.cpf = cpf;
    this.email = email;
  }

  name: string;
  cpf: string;
  email: string;

  public static toEntity(tempDto: TempDto): TempEntity {
    const tempEntity: TempEntity = new TempEntity();
    tempEntity.name = tempDto.name;
    tempEntity.cpf = tempDto.cpf;
    tempEntity.email = tempDto.email;
    return tempEntity;
  }

  public static toDto(tempEntity: TempEntity): TempDto {
    return new TempDto(tempEntity.name, tempEntity.cpf, tempEntity.email);
  }
}
