import { IsNotEmpty } from 'class-validator';

export class ChannelInputDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  type: number;
}
