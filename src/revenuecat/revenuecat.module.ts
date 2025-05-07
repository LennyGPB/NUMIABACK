import { Module } from '@nestjs/common';
import { RevenueCatController } from './revenuecat.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [RevenueCatController],
    providers: [PrismaService],
  })
  export class RevenueCatModule {}
  