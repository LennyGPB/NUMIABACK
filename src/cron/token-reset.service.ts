import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TokenResetService {
  private readonly logger = new Logger(TokenResetService.name);

  constructor(private prisma: PrismaService) {}

  // S’exécute tous les jours à minuit
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async resetTokens() {
    const users = await this.prisma.user.findMany({
        select: {
        id: true,
        isPremium: true,
        },
    });

    const updatePromises = users.map((user) => {
        const tokens = user.isPremium ? 50 : 20;

        return this.prisma.user.update({
        where: { id: user.id },
        data: {
            iaTokens: tokens,
            lastTokenReset: new Date(),
        },
        });
    });

    await Promise.all(updatePromises);

    this.logger.log(`✅ Tokens IA réinitialisés pour ${users.length} utilisateurs`);
    }
}
