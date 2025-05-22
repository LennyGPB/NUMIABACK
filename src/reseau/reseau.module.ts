import { Module, Res } from '@nestjs/common';
import { ReseauController } from './reseau.controller';
import { ReseauService } from './reseau.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [PrismaModule, AiModule],
  providers: [ReseauService],
  controllers: [ReseauController]
})
export class ReseauModule {}
