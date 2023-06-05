import { IsNotEmpty, IsString } from 'class-validator';

export class RestrictionInputDto {
  @IsNotEmpty()
  @IsString()
  restriction: string;
}
