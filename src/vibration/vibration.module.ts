import { Module } from '@nestjs/common';
import { VibrationController } from './vibration.controller';
import { VibrationService } from './vibration.service';
import { Configuration, OpenAIApi } from 'openai';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VibrationController],
  providers: [
    VibrationService,
    {
      provide: OpenAIApi,
      useFactory: () => {
        const config = new Configuration({
          apiKey: process.env.OPENAI_API_KEY,
        });
        return new OpenAIApi(config);
      },
    },
  ],
  exports: [OpenAIApi], 
})
export class VibrationModule {}
