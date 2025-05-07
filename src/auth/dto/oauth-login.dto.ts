import { IsIn, IsNotEmpty } from 'class-validator';

export class OAuthLoginDto {
  @IsIn(['google', 'apple'])
  provider: 'google' | 'apple';

  @IsNotEmpty()
  idToken: string;
}
