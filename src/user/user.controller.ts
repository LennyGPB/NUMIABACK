import { Controller, Get, UseGuards, Post, Body, Patch } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ChooseGuideDto } from 'src/auth/dto/choose-guide.dto';
import { UpdateProfileDto } from 'src/auth/dto/update-profile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: { id: string }) {
    return this.userService.getMe(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('guide-choice')
  async chooseGuide(
    @CurrentUser() user: { userId: string },
    @Body() dto: ChooseGuideDto,
  ) {
    return this.userService.chooseGuide(user.userId, dto.guide);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@CurrentUser() user: { userId: string },@Body() dto: UpdateProfileDto,) 
  {
    return this.userService.updateProfile(user.userId, dto);
  }
}
