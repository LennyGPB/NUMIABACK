import { Controller, Post, Body } from '@nestjs/common';
import { VibrationService } from './vibration.service';
import { GenerateWordsDto } from 'src/auth/dto/generate-words.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('vibration')
export class VibrationController {
  constructor(private readonly vibrationService: VibrationService) {}

  @Post('words')
  async generateWords(@Body() dto: GenerateWordsDto, @CurrentUser() user: { id: string }) {
    const words = await this.vibrationService.generateWords(dto, user.id);
    return { words };
  }
}
