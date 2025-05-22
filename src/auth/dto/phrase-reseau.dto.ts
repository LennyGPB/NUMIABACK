import { IsString, MaxLength, IsNotEmpty } from 'class-validator';

export class prhaseReseauDto {
   @IsString()
   @IsNotEmpty()
   @MaxLength(1000)
   phrase: string;
}
