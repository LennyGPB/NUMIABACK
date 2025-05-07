import { Controller, Post, Headers, Body, HttpCode } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('revenuecat')
export class RevenueCatController {
  constructor(private prisma: PrismaService) {}

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Headers('authorization') auth: string,
    @Body() payload: any
  ) {
    const secret = process.env.REVENUECAT_SECRET;
    if (!auth || auth !== `Bearer ${secret}`) {
      console.warn('Unauthorized webhook access attempt');
      return;
    }

    const { event } = payload;

    if (!event || !event.app_user_id || !event.type) {
      console.warn('Invalid webhook format');
      return;
    }

    const userId = event.app_user_id;
    const eventType = event.type;

    console.log(`🧠 Webhook reçu : ${eventType} pour user ${userId}`);

    // Types d'événements considérés comme premium actif
    const premiumEvents = ['INITIAL_PURCHASE', 'RENEWAL', 'UNCANCELLATION'];

    // Types d'événements qui désactivent l'abonnement
    const cancelEvents = ['EXPIRATION', 'CANCELLATION', 'NON_RENEWING_PURCHASE'];

    if (premiumEvents.includes(eventType)) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { isPremium: true },
      });
      console.log('✅ Abonnement activé en base');
    } else if (cancelEvents.includes(eventType)) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { isPremium: false },
      });
      console.log('❌ Abonnement désactivé en base');
    } else {
      console.log('ℹ️ Événement non traité :', eventType);
    }
  }
}