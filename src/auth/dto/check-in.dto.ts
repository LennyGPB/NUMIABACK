import { IsIn, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CheckInDto {
  @IsIn(['bien', 'calme', 'stressé', 'fatigué', 'triste', 'confus', 'heureux'])
  mood: 'bien' | 'calme' | 'stressé' | 'fatigué' | 'triste' | 'confus' | 'heureux';
}
