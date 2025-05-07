import { IsEmail, IsNotEmpty, IsDateString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsDateString()
  birthDate: string;

  @MinLength(6)
  password: string;
}
