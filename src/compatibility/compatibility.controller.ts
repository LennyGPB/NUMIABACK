import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompatibilityService } from './compatibility.service';
import { CheckCompatibilityDto } from 'src/auth/dto/check-compatibility.dto';

@Controller('compatibility')
export class CompatibilityController {
  constructor(private readonly compatibilityService: CompatibilityService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async check(@Body() dto: CheckCompatibilityDto) {
    return this.compatibilityService.checkCompatibility(dto);
  }
}
