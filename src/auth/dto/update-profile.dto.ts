import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  birthDate: string;
}
