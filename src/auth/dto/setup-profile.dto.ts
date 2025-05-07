import { IsString, IsDateString, IsNotEmpty } from 'class-validator';

export class SetupProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  birthDate: string;
}
