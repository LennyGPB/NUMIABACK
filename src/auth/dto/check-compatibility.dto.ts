import { IsDateString } from 'class-validator';

export class CheckCompatibilityDto {
  @IsDateString()
  birthDate1: string;

  @IsDateString()
  birthDate2: string;
}
