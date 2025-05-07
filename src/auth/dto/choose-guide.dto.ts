import { IsString, IsIn } from 'class-validator';

export class ChooseGuideDto {
  @IsString()
  @IsIn(['Le Sage', 'La Guerrière', 'L’Enfant Intérieur', 'L’Ancienne']) // tu peux étendre cette liste
  guide: string;
}
