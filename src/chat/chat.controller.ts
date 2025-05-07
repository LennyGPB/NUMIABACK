import { Controller, Post, Body, UseGuards, Get, Query, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SendMessageDto } from 'src/auth/dto/send-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('message')
  async sendMessage(
    @CurrentUser() user: { userId: string },
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(user.userId, dto.message);
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
  async clearHistory(@CurrentUser() user: { userId: string }) {
    return this.chatService.clearHistory(user.userId);
  }
}
