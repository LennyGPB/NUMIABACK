import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AskQuestionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  question: string;
}
