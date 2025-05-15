import { Injectable } from '@nestjs/common';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PushService {
  private expo = new Expo();

  constructor(private prisma: PrismaService) {}

  async saveUserToken(userId: string, token: string) {
    if (!Expo.isExpoPushToken(token)) {
      throw new Error('Token Expo invalide');
    }

    // Vérifie si le token est déjà enregistré
    const existing = await this.prisma.pushToken.findFirst({
      where: { userId, token },
    });

    if (existing) return existing;

    // Crée le token
    return this.prisma.pushToken.create({
      data: { userId, token },
    });
  }

  async sendMultipleNotifications(tokens: string[], title: string, body: string) {
    const validTokens = tokens.filter(Expo.isExpoPushToken);

    const messages: ExpoPushMessage[] = validTokens.map(token => ({
      to: token,
      sound: 'default',
      title,
      body,
    }));

    const chunks = this.expo.chunkPushNotifications(messages);
    const receipts: ExpoPushTicket[] = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        receipts.push(...ticketChunk);
      } catch (error) {
        console.error('Erreur d’envoi des notifications :', error);
      }
    }

    return receipts;
  }

}
