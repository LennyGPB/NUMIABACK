import { Controller, Post, Body, UseGuards, Get, Query, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SendMessageDto } from 'src/auth/dto/send-message.dto';
import { Throttle, ThrottlerModule } from '@nestjs/throttler';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Throttle({ default: { limit: 17, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  @Post('message')
  async sendMessage(
    @CurrentUser() user: { id: string },
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(user.id, dto.message);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getHistory(
    @CurrentUser() user: { userId: string },
    @Query('limit') limit?: string
  ) {
    const parsedLimit = limit ? parseInt(limit) : 10;
    return this.chatService.getHistory(user.userId, parsedLimit);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('history')
  async clearHistory(@CurrentUser() user: { id: string }) {
    return this.chatService.clearHistory(user.id);
  }
}
