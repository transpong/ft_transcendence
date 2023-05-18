import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class TypeInputDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(2)
  type: number;
}
