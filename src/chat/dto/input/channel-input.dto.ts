import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ChannelInputDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  password: string;

  @IsNotEmpty()
  @IsInt()
  type: number;
}
