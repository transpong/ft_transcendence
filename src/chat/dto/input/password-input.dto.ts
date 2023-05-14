import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class PasswordInputDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
