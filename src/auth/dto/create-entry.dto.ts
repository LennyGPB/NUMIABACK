import { IsString, Length } from 'class-validator';

export class CreateJournalEntryDto {
  @IsString()
  @Length(1, 300, { message: 'Le contenu doit faire entre 1 et 300 caractères.' })
  content: string;
}
