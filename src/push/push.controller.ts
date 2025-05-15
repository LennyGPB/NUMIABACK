import { Controller, Post, Body } from '@nestjs/common';
import { PushService } from './push.service';
import { PrismaService } from 'src/prisma/prisma.service'; // ⚠️ adapte le chemin si besoin

@Controller('notifications')
export class PushController {
  constructor(
    private readonly pushService: PushService,
    private readonly prisma: PrismaService, // ✅ on injecte Prisma ici pour faire une recherche utilisateur
  ) {}

  // @Post('send')
  // async sendNotification(
  //   @Body() body: { token: string; title: string; message: string },
  // ) {
  //   return this.pushService.sendNotification(
  //     body.token,
  //     body.title,
  //     body.message,
  //   );
  // }

  @Post('token')
  saveToken(@Body() body: { token: string; userId: string }) {
    return this.pushService.saveUserToken(body.userId, body.token);
  }

  @Post('test')
  async test(@Body() body: { userId: string }) {
  const user = await this.prisma.user.findUnique({
    where: { id: body.userId },
    include: { pushTokens: true },
  });

  const tokens = user?.pushTokens?.map(t => t.token);

  if (!tokens || tokens.length === 0) {
    throw new Error('Aucun token enregistré pour cet utilisateur.');
  }

  return this.pushService.sendMultipleNotifications(
    tokens,
    '🎉 Notification test',
    'Salut depuis ton backend NestJS 🚀'
  );
}

}
