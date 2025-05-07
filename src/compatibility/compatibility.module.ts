// src/compatibility/compatibility.module.ts
import { Module } from '@nestjs/common';
import { CompatibilityController } from './compatibility.controller';
import { CompatibilityService } from './compatibility.service';
import { AiService } from '../ai/ai.service'; // car utilisé dans le service
import { AiModule } from '../ai/ai.module';   // pour fournir l’AiService

@Module({
  imports: [AiModule],
  controllers: [CompatibilityController],
  providers: [CompatibilityService],
})
export class CompatibilityModule {}
