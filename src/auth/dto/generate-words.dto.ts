import { IsIn, IsNumber } from 'class-validator';

export class GenerateWordsDto {
  @IsIn(['collective', 'personal'])
  type: 'collective' | 'personal';

  @IsNumber()
  number: number;
}
