import { Controller, Get, UseGuards, Query, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { GuidanceService } from './guidance.service';
import { AskQuestionDto } from 'src/auth/dto/ask-question.dto';
import { DrawGuidanceDto } from 'src/auth/dto/draw-guidance.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('guidance')
export class GuidanceController {
  constructor(private readonly guidanceService: GuidanceService) {}

  @UseGuards(JwtAuthGuard)
  @Get('today')
  async getTodayGuidance(@CurrentUser() user: { userId: string }) {
    return this.guidanceService.getToday(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getHistory(
    @CurrentUser() user: { userId: string },
    @Query('limit') limit?: string, // ex : /guidance/history?limit=5
  ) {
    const historyLimit = limit ? parseInt(limit) : 7;
    return this.guidanceService.getHistory(user.userId, historyLimit);
  }

  @UseGuards(JwtAuthGuard)
  @Post('question')
  async askQuestion(@CurrentUser() user: { userId: string }, @Body() dto: AskQuestionDto,)
  {
    return this.guidanceService.askQuestion(user.userId, dto.question);
  }

  @UseGuards(JwtAuthGuard)
  @Post('draw')
  async drawThematicGuidance(
    @CurrentUser() user: { userId: string },
    @Body() dto: DrawGuidanceDto,
  ) {
    return this.guidanceService.drawGuidance(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('life-path')
  async getLifePathPhrase(@CurrentUser() user: { userId: string }) {
    return this.guidanceService.generateLifePathMessage(user.userId);
  }

}
