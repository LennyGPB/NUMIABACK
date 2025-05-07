import { Module } from '@nestjs/common';
import { GuidanceService } from './guidance.service';
import { GuidanceController } from './guidance.controller';
import { Prisma } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [PrismaModule, AiModule],
  providers: [GuidanceService],
  controllers: [GuidanceController]
})
export class GuidanceModule {}
