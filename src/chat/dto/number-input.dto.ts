import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class NumberInputDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1)
  type: number;
}
