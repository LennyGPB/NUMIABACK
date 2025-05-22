import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GuidanceModule } from './guidance/guidance.module';
import { AiService } from './ai/ai.service';
import { AiModule } from './ai/ai.module';
import { ChatModule } from './chat/chat.module';
import { CompatibilityController } from './compatibility/compatibility.controller';
import { CompatibilityService } from './compatibility/compatibility.service';
import { CompatibilityModule } from './compatibility/compatibility.module';
import { RevenueCatModule } from './revenuecat/revenuecat.module';
import { RevenueCatController } from './revenuecat/revenuecat.controller';
import { VibrationService } from './vibration/vibration.service';
import { VibrationController } from './vibration/vibration.controller';
import { VibrationModule } from './vibration/vibration.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';
import { CronModule } from './cron/cron.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AdminModule } from './admin/admin.module';
import { PushService } from './push/push.service';
import { PushController } from './push/push.controller';
import { PushModule } from './push/push.module';
import { JournalController } from './journal/journal.controller';
import { JournalService } from './journal/journal.service';
import { JournalModule } from './journal/journal.module';
import { ReseauService } from './reseau/reseau.service';
import { ReseauModule } from './reseau/reseau.module';


@Module({
  imports: [PrismaModule, ConfigModule.forRoot({isGlobal: true}), 
    AuthModule, 
    UserModule, 
    GuidanceModule, 
    AiModule, 
    ChatModule, 
    CompatibilityModule, 
    RevenueCatModule, 
    VibrationModule, 
    ScheduleModule.forRoot(), 
    CronModule, 
    AdminModule,
    PushModule, 
    ThrottlerModule.forRoot([
      {
        ttl: 60000, 
        limit: 20, 
      },
    ]), JournalModule, ReseauModule,
   
  ],
  controllers: [AppController, CompatibilityController, RevenueCatController, VibrationController, PushController, JournalController],
  providers: [AppService, AiService, CompatibilityService, VibrationService, CronService, PushService, JournalService, ReseauService],
})
export class AppModule {}
