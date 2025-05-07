import { IsIn, IsOptional, IsInt, Min, Max } from 'class-validator';

export class DrawGuidanceDto {
  @IsIn(['amour', 'carriere', 'spiritualite', 'blocages'])
  theme: 'amour' | 'carriere' | 'spiritualite' | 'blocages';

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  nbNumbers?: number; // par défaut : 1
}
