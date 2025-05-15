import { Controller, Post, Get, Body, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { JournalService } from './journal.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateJournalEntryDto } from 'src/auth/dto/create-entry.dto';

@Controller('journal')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create( @CurrentUser() user: { id: string }, @Body() dto: CreateJournalEntryDto) 
  {
    return this.journalService.createOrUpdateEntry(user.id, dto.content);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getHistory(@CurrentUser() user: { id: string },@Query('limit') limit?: string) 
  {
    const parsedLimit = limit ? parseInt(limit) : 35;
    return this.journalService.getEntries(user.id, parsedLimit);
  }
}
