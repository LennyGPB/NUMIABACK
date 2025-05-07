import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AiModule } from 'src/ai/ai.module';
import { Prisma } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [AiModule, PrismaModule],
  controllers: [ChatController],
  providers: [ChatService]
})
export class ChatModule {}
