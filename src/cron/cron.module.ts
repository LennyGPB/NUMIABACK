import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module';
import { TokenResetService } from './token-reset.service';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  providers: [TokenResetService],
})
export class CronModule {}
