import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JournalPrivate } from '@prisma/client';

@Injectable()
export class JournalService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdateEntry(userId: string, content: string): Promise<JournalPrivate> {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    return this.prisma.journalPrivate.upsert({
      where: {
        userId_date: {
          userId,
          date: todayStart,
        },
      },
      update: {
        content,
      },
      create: {
        userId,
        content,
        date: todayStart,
      },
    });
  }

  async getEntries(userId: string, limit = 35): Promise<JournalPrivate[]> {
    return this.prisma.journalPrivate.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
    });
  }
}
