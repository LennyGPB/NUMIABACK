import { Controller, Get, UseGuards, Query, Post, Body } from '@nestjs/common';
import { ReseauService } from './reseau.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { prhaseReseauDto } from 'src/auth/dto/phrase-reseau.dto';
import { PremiumGuard } from 'src/auth/guards/premium.guard';

@Controller('reseau')
export class ReseauController {
    constructor(private readonly reseauService: ReseauService) {}

    @UseGuards(JwtAuthGuard, PremiumGuard)
    @Post('sendphrase')
    async sendPhraseToReseau(@Body() dto: prhaseReseauDto, @CurrentUser() user: { id: string }) 
    {
        return this.reseauService.sendPhraseToReseau(dto.phrase, user.id, dto);
    }

    @UseGuards(JwtAuthGuard, PremiumGuard)
    @Post('phrasebyvibration')
    async getPhraseByVibration(number: number, @CurrentUser() user: { id: string })
    {
        return this.reseauService.getReseauByVibration(number);
    }

    @UseGuards(JwtAuthGuard, PremiumGuard)
    @Get('phrase')
    async getPhrase(@CurrentUser() user: { id: string })
    {
        return this.reseauService.getReseau();
    }

    @UseGuards(JwtAuthGuard, PremiumGuard)
    @Get('phrasebyid')
    async getPhraseById(@CurrentUser() user: { id: string })
    {
        return this.reseauService.getReseauById(user.id);
    }
}
